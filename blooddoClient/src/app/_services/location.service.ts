import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

declare const navigator: any;

@Injectable()
export class LocationService {

  private subject: Subject<any> = new Subject<any>();

  setLocation(location:any): void {
    this.subject.next({lon:location.lon, lat:location.lat});
  }

  reqLocation() {
    let that = this;
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    function success(pos) {
      var crd = pos.coords;
      that.setLocation({lon: crd.latitude, lat: crd.longitude});
    };

    function error(err) {
      that.setLocation({lon: 37.777220, lat: -122.445499});
    };

    navigator.geolocation.getCurrentPosition(success, error, options);

  }

  observeLocation(): Observable<any> {
    this.reqLocation();
    return this.subject.asObservable();
  }

}
