import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { JsonpModule, Jsonp } from '@angular/http';
import * as io from "socket.io-client";

import { EsriLoaderService } from 'angular2-esri-loader';
import { BlooddoService } from '../_services/blooddo.service';
import { LocationService } from '../_services/location.service';

import { environment } from '../../environments/environment';

@Component({
  selector: 'app-esri-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  public mapView;
  public title: string = 'Blooddo service';
  public donor: boolean = true;
  ip;
  showDonorsOnMap;
  socket = io(environment.host);
  loading = true;
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;
  @ViewChild('newDonorPopup') private newDonorPopupEl;

  constructor(
    private esriLoader: EsriLoaderService,
    private blooddo: BlooddoService,
    private jsonp: Jsonp,
    private location: LocationService
  ) { }

  public ngOnInit() {
    let that = this;

    this.socket.on('data-chaged', function (data) {
      that.showDonorsOnMap(!that.donor);
    });

    this.getClientIP();

    return this.esriLoader.load({
      // use a specific version of the JSAPI
      url: 'https://js.arcgis.com/4.3/'
    }).then(() => {
      that.reqLocation();
    });
  }

  getClientIP() {
    this.jsonp.get('//api.ipify.org/?format=jsonp&callback=JSONP_CALLBACK').subscribe(response => this.ip = response['_body'].ip );
  }

  reqLocation() {
    let that = this;
    this.location.observeLocation().subscribe((location: {lon:number, lat:number}) => {
      that.loadMap(location.lon, location.lat);
    });

  }

  loadMap(lat, lon) {
    let that = this;
    // load the needed Map and MapView modules from the JSAPI
    this.esriLoader.loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/widgets/Search',
      'esri/tasks/Locator',
      'esri/geometry/Point',
      'esri/symbols/SimpleMarkerSymbol',
      'esri/Graphic'
    ]).then(([
      Map,
      MapView,
      Search,
      Locator,
      Point,
      SimpleMarkerSymbol,
      Graphic
    ]) => {
      const mapProperties: any = {
        basemap: 'topo'
      };

      var locatorTask = new Locator({
        url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
      });

      const map: any = new Map(mapProperties);


      const mapViewProperties: any = {
        container: this.mapViewEl.nativeElement,
        center: [lon, lat],
        zoom: 12,
        map
      };
      let that = this;
      this.mapView = new MapView(mapViewProperties);

      that.loading = false;

      this.mapView.on("drag", function(evt){
       that.showDonorsOnMap(!that.donor);
      });


      var searchWidget = new Search({
        view: this.mapView
      });
      this.mapView.ui.add(searchWidget, {
        position: "top-left",
        index: 2
      });

      /////////////////////////////////////////////
      this.showDonorsOnMap = function(showFlag) {
        if (!showFlag) {
          this.mapView.graphics.removeAll();
        } else {
          this.mapView.graphics.removeAll();
          this.blooddo.getDonors(this.mapView.extent)
              .subscribe(
                (response) => {

                  if (environment.logging) console.log('Response: '+JSON.stringify(response));

                  var markerSymbol = new SimpleMarkerSymbol({
                    style: "diamond",
                    color: "red",
                    size: "16px",  // pixels
                    outline: {  // autocasts as esri/symbols/SimpleLineSymbol
                      color: [ 0, 0, 0 ],
                      width: 1  // points
                    }
                  });

                  for(let i=0; i<response.length; i++) {
                    const item = response[i];
                    let point = new Point({
                      longitude: item.lon,
                      latitude: item.lat
                    });
                    let markerAttr = {
                      'First name': item.firstName,
                      'Last name': item.lastName,
                      'Contact number': item.contactNumber,
                      'Email': item.email,
                      'Blood group': item.bloodGroup,
                      'Address': item.address
                    };

                    var markerGraphic = new Graphic({
                      geometry: point,
                      symbol: markerSymbol,
                      attributes: markerAttr,
                      popupTemplate: {
                        title: "Donor",
                        content: "First name: {First name} <br />" +
                        "Last name: {Last name} <br />"+
                        "Contact number: <a onClick='this.innerHTML = \"{Contact number}\";'> (click to show)</a><br />"+
                        "Email: <a onClick='this.innerHTML = \"{Email}\";'> (click to show)</a><br />"+
                        "Blood group: {Blood group} <br />"+
                        "Address: {Address} <br />"
                      }
                    });
                    this.mapView.graphics.add(markerGraphic);
                  }
                },
                (error) =>  {
                  if (environment.logging) console.log('Response error: '+error);
                });

        }

      }

      this.mapView.watch('center', function(event){
        that.showDonorsOnMap(!that.donor);
      });

      ////////////////////////////////////////////////////////////
      this.mapView.on("click", function(event){
        // event is the event handle returned after the event fires.
        if (that.donor) {

          locatorTask.locationToAddress(event.mapPoint).then(function(
          response) {
            // If an address is successfully found, print it to the popup's content
            that.newDonorPopupEl.showNewDonorForm({
              address: response.address.Match_addr,
              lat: Math.round(event.mapPoint.latitude * 1000) / 1000,
              lon: Math.round(event.mapPoint.longitude * 1000) / 1000,
              ip: that.ip,
              x: event.mapPoint.x,
              y: event.mapPoint.y
            });
          }).otherwise(function(err) {
            /* TODO show alert */
            if (environment.logging) console.log('No address was found for this location: '+ err);

          });
        }
      });
    });
  }

  onSwitchChange() {
    this.showDonorsOnMap(!this.donor);
  }

}
