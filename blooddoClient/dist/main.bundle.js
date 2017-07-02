webpackJsonp([1,4],{

/***/ 155:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_throw__ = __webpack_require__(723);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_throw___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_throw__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch__ = __webpack_require__(724);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__ = __webpack_require__(725);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BlooddoService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var BlooddoService = (function () {
    function BlooddoService(http) {
        this.http = http;
    }
    BlooddoService.prototype.getDonors = function (extent) {
        return this.http.get('api/donors?xmin=' + extent.xmin + '&xmax=' + extent.xmax + '&ymin=' + extent.ymin + '&ymax=' + extent.ymax)
            .map(this.extractData)
            .catch(this.handleError);
    };
    BlooddoService.prototype.postDonor = function (newDonor) {
        return this.http.post('api/donor', newDonor)
            .map(this.extractData)
            .catch(this.handleError);
    };
    BlooddoService.prototype.getDonor = function (link) {
        return this.http.get('api/donor/' + link)
            .map(this.extractData)
            .catch(this.handleError);
    };
    BlooddoService.prototype.deleteDonor = function (link) {
        return this.http.delete('api/donor/' + link)
            .map(this.extractData)
            .catch(this.handleError);
    };
    BlooddoService.prototype.updateDonor = function (link, donor) {
        return this.http.put('api/donor/' + link, {
            firstName: donor.firstName,
            lastName: donor.lastName,
            contactNumber: donor.contactNumber,
            email: donor.email,
            bloodGroup: donor.bloodGroup
        })
            .map(this.extractData)
            .catch(this.handleError);
    };
    BlooddoService.prototype.extractData = function (res) {
        var body = res.json();
        return body || {};
    };
    BlooddoService.prototype.handleError = function (error) {
        // In a real world app, you might use a remote logging infrastructure
        var errMsg;
        if (error instanceof __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Response */]) {
            var body = null;
            try {
                body = error.json();
                var err = body.error || JSON.stringify(body);
                errMsg = error.status + " - " + (error.statusText || '') + " " + err;
                if (error.status === 400)
                    errMsg = 'Server can not process your request. Probably your request is malformed.';
                if (error.status === 401)
                    errMsg = 'Server can not process your request. You were not authorized to perform the action.';
            }
            catch (e) {
                errMsg = error.status + " - " + (error.statusText || '') + " " + JSON.stringify(error);
                if (error.status === 400)
                    errMsg = 'Server can not process your request. Probably your request is malformed.';
                if (error.status === 401)
                    errMsg = 'Server can not process your request. You were not authorized to perform the action.';
                if (error.status === 404)
                    errMsg = 'Server can not process your request. Resource not found.';
            }
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].throw(errMsg);
    };
    BlooddoService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */]) === 'function' && _a) || Object])
    ], BlooddoService);
    return BlooddoService;
    var _a;
}());
//# sourceMappingURL=/Users/champact/Desktop/Development/crossover/blooddo/Code/blooddoClient/src/blooddo.service.js.map

/***/ }),

/***/ 156:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.
var environment = {
    production: false,
    logging: true
};
//# sourceMappingURL=/Users/champact/Desktop/Development/crossover/blooddo/Code/blooddoClient/src/environment.js.map

/***/ }),

/***/ 343:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LocationService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var LocationService = (function () {
    function LocationService() {
        this.subject = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Subject__["Subject"]();
    }
    LocationService.prototype.setLocation = function (location) {
        this.subject.next({ lon: location.lon, lat: location.lat });
    };
    LocationService.prototype.reqLocation = function () {
        var that = this;
        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        function success(pos) {
            var crd = pos.coords;
            that.setLocation({ lon: crd.latitude, lat: crd.longitude });
        }
        ;
        function error(err) {
            that.setLocation({ lon: 37.777220, lat: -122.445499 });
        }
        ;
        navigator.geolocation.getCurrentPosition(success, error, options);
    };
    LocationService.prototype.observeLocation = function () {
        this.reqLocation();
        return this.subject.asObservable();
    };
    LocationService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(), 
        __metadata('design:paramtypes', [])
    ], LocationService);
    return LocationService;
}());
//# sourceMappingURL=/Users/champact/Desktop/Development/crossover/blooddo/Code/blooddoClient/src/location.service.js.map

/***/ }),

/***/ 344:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(337);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_blooddo_service__ = __webpack_require__(155);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(156);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DonorComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var DonorComponent = (function () {
    function DonorComponent(blooddo, route, router) {
        this.blooddo = blooddo;
        this.route = route;
        this.router = router;
        this.editing = false;
        this.deleted = false;
        this.donorData = null;
    }
    DonorComponent.prototype.ngOnInit = function () {
        var that = this;
        this.link = this.route.snapshot.params['link'];
        this.blooddo.getDonor(this.link)
            .subscribe(function (response) {
            if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].logging)
                console.log('Response: ' + JSON.stringify(response));
            that.donorData = response;
        }, function (error) {
            if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].logging)
                console.log('Response error: ' + error);
            that.alert = 'Donor not found';
        });
    };
    DonorComponent.prototype.edit = function () {
        this.editing = true;
        document.getElementById("edit").style.display = "block";
        this.donorFormGroupsEl.extendDonorData(this.donorData);
    };
    DonorComponent.prototype.cancelDonor = function () {
        this.editing = false;
        document.getElementById("edit").style.display = "none";
    };
    DonorComponent.prototype.deleteDonor = function () {
        var _this = this;
        var that = this;
        this.alert = null;
        this.blooddo.deleteDonor(this.link)
            .subscribe(function (response) {
            _this.deleted = true;
        }, function (error) {
            _this.deleted = false;
            _this.alert = 'Could not delete donor';
        });
    };
    DonorComponent.prototype.updateDonor = function () {
        var that = this;
        this.alert = null;
        this.blooddo.updateDonor(this.link, this.donorFormGroupsEl.donor.getJSON())
            .subscribe(function (response) {
            if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].logging)
                console.log('Response: ' + JSON.stringify(response));
            that.donorData = response;
            that.editing = false;
            document.getElementById("edit").style.display = "none";
        }, function (error) {
            if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].logging)
                console.log('Response error: ' + error);
            that.alert = 'Upload failed!';
        });
    };
    DonorComponent.prototype.home = function () {
        return this.router.navigate(['/']);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('donorFormGroups'), 
        __metadata('design:type', Object)
    ], DonorComponent.prototype, "donorFormGroupsEl", void 0);
    DonorComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-donor',
            template: __webpack_require__(716),
            styles: [__webpack_require__(711)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__services_blooddo_service__["a" /* BlooddoService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__services_blooddo_service__["a" /* BlooddoService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* ActivatedRoute */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* Router */]) === 'function' && _c) || Object])
    ], DonorComponent);
    return DonorComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=/Users/champact/Desktop/Development/crossover/blooddo/Code/blooddoClient/src/donor.component.js.map

/***/ }),

/***/ 345:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_socket_io_client__ = __webpack_require__(740);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_socket_io_client___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_socket_io_client__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angular2_esri_loader__ = __webpack_require__(346);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angular2_esri_loader___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_angular2_esri_loader__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__services_blooddo_service__ = __webpack_require__(155);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_location_service__ = __webpack_require__(343);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__environments_environment__ = __webpack_require__(156);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var MapComponent = (function () {
    function MapComponent(esriLoader, blooddo, jsonp, location) {
        this.esriLoader = esriLoader;
        this.blooddo = blooddo;
        this.jsonp = jsonp;
        this.location = location;
        this.title = 'Blooddo service';
        this.donor = true;
        this.socket = __WEBPACK_IMPORTED_MODULE_2_socket_io_client__('http://localhost:3001');
        this.loading = true;
    }
    MapComponent.prototype.ngOnInit = function () {
        var that = this;
        this.socket.on('data-chaged', function (data) {
            that.showDonorsOnMap(!that.donor);
        });
        this.getClientIP();
        return this.esriLoader.load({
            // use a specific version of the JSAPI
            url: 'https://js.arcgis.com/4.3/'
        }).then(function () {
            that.reqLocation();
        });
    };
    MapComponent.prototype.getClientIP = function () {
        var _this = this;
        this.jsonp.get('//api.ipify.org/?format=jsonp&callback=JSONP_CALLBACK').subscribe(function (response) { return _this.ip = response['_body'].ip; });
    };
    MapComponent.prototype.reqLocation = function () {
        var that = this;
        this.location.observeLocation().subscribe(function (location) {
            that.loadMap(location.lon, location.lat);
        });
    };
    MapComponent.prototype.loadMap = function (lat, lon) {
        var _this = this;
        var that = this;
        // load the needed Map and MapView modules from the JSAPI
        this.esriLoader.loadModules([
            'esri/Map',
            'esri/views/MapView',
            'esri/widgets/Search',
            'esri/tasks/Locator',
            'esri/geometry/Point',
            'esri/symbols/SimpleMarkerSymbol',
            'esri/Graphic'
        ]).then(function (_a) {
            var Map = _a[0], MapView = _a[1], Search = _a[2], Locator = _a[3], Point = _a[4], SimpleMarkerSymbol = _a[5], Graphic = _a[6];
            var mapProperties = {
                basemap: 'topo'
            };
            var locatorTask = new Locator({
                url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
            });
            var map = new Map(mapProperties);
            var mapViewProperties = {
                container: _this.mapViewEl.nativeElement,
                center: [lon, lat],
                zoom: 12,
                map: map
            };
            var that = _this;
            _this.mapView = new MapView(mapViewProperties);
            that.loading = false;
            _this.mapView.on("drag", function (evt) {
                that.showDonorsOnMap(!that.donor);
            });
            var searchWidget = new Search({
                view: _this.mapView
            });
            _this.mapView.ui.add(searchWidget, {
                position: "top-left",
                index: 2
            });
            /////////////////////////////////////////////
            _this.showDonorsOnMap = function (showFlag) {
                var _this = this;
                if (!showFlag) {
                    this.mapView.graphics.removeAll();
                }
                else {
                    this.blooddo.getDonors(this.mapView.extent)
                        .subscribe(function (response) {
                        if (__WEBPACK_IMPORTED_MODULE_6__environments_environment__["a" /* environment */].logging)
                            console.log('Response: ' + JSON.stringify(response));
                        var markerSymbol = new SimpleMarkerSymbol({
                            style: "diamond",
                            color: "red",
                            size: "16px",
                            outline: {
                                color: [0, 0, 0],
                                width: 1 // points
                            }
                        });
                        for (var i = 0; i < response.length; i++) {
                            var item = response[i];
                            var point = new Point({
                                longitude: item.lon,
                                latitude: item.lat
                            });
                            var markerAttr = {
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
                                        "Last name: {Last name} <br />" +
                                        "Contact number: <a onClick='this.innerHTML = \"{Contact number}\";'> (click to show)</a><br />" +
                                        "Email: <a onClick='this.innerHTML = \"{Email}\";'> (click to show)</a><br />" +
                                        "Blood group: {Blood group} <br />" +
                                        "Address: {Address} <br />"
                                }
                            });
                            _this.mapView.graphics.add(markerGraphic);
                        }
                    }, function (error) {
                        if (__WEBPACK_IMPORTED_MODULE_6__environments_environment__["a" /* environment */].logging)
                            console.log('Response error: ' + error);
                    });
                }
            };
            _this.mapView.watch('center', function (event) {
                that.showDonorsOnMap(!that.donor);
            });
            ////////////////////////////////////////////////////////////
            _this.mapView.on("click", function (event) {
                // event is the event handle returned after the event fires.
                if (that.donor) {
                    locatorTask.locationToAddress(event.mapPoint).then(function (response) {
                        // If an address is successfully found, print it to the popup's content
                        that.newDonorPopupEl.showNewDonorForm({
                            address: response.address.Match_addr,
                            lat: Math.round(event.mapPoint.latitude * 1000) / 1000,
                            lon: Math.round(event.mapPoint.longitude * 1000) / 1000,
                            ip: that.ip,
                            x: event.mapPoint.x,
                            y: event.mapPoint.y
                        });
                    }).otherwise(function (err) {
                        /* TODO show alert */
                        if (__WEBPACK_IMPORTED_MODULE_6__environments_environment__["a" /* environment */].logging)
                            console.log('No address was found for this location: ' + err);
                    });
                }
            });
        });
    };
    MapComponent.prototype.onSwitchChange = function () {
        this.showDonorsOnMap(!this.donor);
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('mapViewNode'), 
        __metadata('design:type', (typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"]) === 'function' && _a) || Object)
    ], MapComponent.prototype, "mapViewEl", void 0);
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('newDonorPopup'), 
        __metadata('design:type', Object)
    ], MapComponent.prototype, "newDonorPopupEl", void 0);
    MapComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-esri-map',
            template: __webpack_require__(718),
            styles: [__webpack_require__(713)]
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3_angular2_esri_loader__["EsriLoaderService"] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3_angular2_esri_loader__["EsriLoaderService"]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_4__services_blooddo_service__["a" /* BlooddoService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__services_blooddo_service__["a" /* BlooddoService */]) === 'function' && _c) || Object, (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* Jsonp */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["e" /* Jsonp */]) === 'function' && _d) || Object, (typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_5__services_location_service__["a" /* LocationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_5__services_location_service__["a" /* LocationService */]) === 'function' && _e) || Object])
    ], MapComponent);
    return MapComponent;
    var _a, _b, _c, _d, _e;
}());
//# sourceMappingURL=/Users/champact/Desktop/Development/crossover/blooddo/Code/blooddoClient/src/map.component.js.map

/***/ }),

/***/ 411:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 411;


/***/ }),

/***/ 412:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(499);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__environments_environment__ = __webpack_require__(156);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_app_module__ = __webpack_require__(532);




if (__WEBPACK_IMPORTED_MODULE_2__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["enableProdMode"])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_3__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=/Users/champact/Desktop/Development/crossover/blooddo/Code/blooddoClient/src/main.js.map

/***/ }),

/***/ 529:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Donor; });
var Donor = (function () {
    function Donor(firstName, lastName, contactNumber, email, bloodGroup, lat, lon, address, ip, x, y) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.contactNumber = contactNumber;
        this.email = email;
        this.bloodGroup = bloodGroup;
        this.lat = lat;
        this.lon = lon;
        this.address = address;
        this.ip = ip;
        this.x = x;
        this.y = y;
        this.warn = null;
    }
    Donor.prototype.getJSON = function () {
        return {
            firstName: this.firstName,
            lastName: this.lastName,
            contactNumber: this.contactNumber,
            email: this.email,
            bloodGroup: this.bloodGroup,
            lat: this.lat,
            lon: this.lon,
            address: this.address,
            ip: this.ip,
            x: this.x,
            y: this.y
        };
    };
    Donor.prototype.verify = function () {
        /* TODO */
        return null;
        // this.warn = 'Email is wrong';
        // return this.warn;
    };
    return Donor;
}());
//# sourceMappingURL=/Users/champact/Desktop/Development/crossover/blooddo/Code/blooddoClient/src/Donor.js.map

/***/ }),

/***/ 530:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Report; });
var Report = (function () {
    function Report(code, data) {
        this.code = code;
        this.data = data;
    }
    return Report;
}());
//# sourceMappingURL=/Users/champact/Desktop/Development/crossover/blooddo/Code/blooddoClient/src/Report.js.map

/***/ }),

/***/ 531:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(715),
            styles: [__webpack_require__(710)]
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
//# sourceMappingURL=/Users/champact/Desktop/Development/crossover/blooddo/Code/blooddoClient/src/app.component.js.map

/***/ }),

/***/ 532:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(490);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angular2_esri_loader__ = __webpack_require__(346);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angular2_esri_loader___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_angular2_esri_loader__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__services_blooddo_service__ = __webpack_require__(155);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__services_location_service__ = __webpack_require__(343);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__app_component__ = __webpack_require__(531);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__header_header_component__ = __webpack_require__(536);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__footer_footer_component__ = __webpack_require__(535);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__donor_donor_component__ = __webpack_require__(344);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__map_map_component__ = __webpack_require__(345);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__newDonorPopup_new_donor_popup_component__ = __webpack_require__(537);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__donorFormGroups_donor_form_groups_component__ = __webpack_require__(534);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__app_routing__ = __webpack_require__(533);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
















var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_8__header_header_component__["a" /* HeaderComponent */],
                __WEBPACK_IMPORTED_MODULE_9__footer_footer_component__["a" /* FooterComponent */],
                __WEBPACK_IMPORTED_MODULE_11__map_map_component__["a" /* MapComponent */],
                __WEBPACK_IMPORTED_MODULE_10__donor_donor_component__["a" /* DonorComponent */],
                __WEBPACK_IMPORTED_MODULE_12__newDonorPopup_new_donor_popup_component__["a" /* NewDonorPopupComponent */],
                __WEBPACK_IMPORTED_MODULE_13__donorFormGroups_donor_form_groups_component__["a" /* DonorFormGroupsComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["b" /* JsonpModule */],
                __WEBPACK_IMPORTED_MODULE_14__app_routing__["a" /* routing */]
            ],
            providers: [__WEBPACK_IMPORTED_MODULE_4_angular2_esri_loader__["EsriLoaderService"], __WEBPACK_IMPORTED_MODULE_5__services_blooddo_service__["a" /* BlooddoService */], __WEBPACK_IMPORTED_MODULE_6__services_location_service__["a" /* LocationService */]],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_7__app_component__["a" /* AppComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
//# sourceMappingURL=/Users/champact/Desktop/Development/crossover/blooddo/Code/blooddoClient/src/app.module.js.map

/***/ }),

/***/ 533:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_router__ = __webpack_require__(337);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__map_map_component__ = __webpack_require__(345);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__donor_donor_component__ = __webpack_require__(344);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return routing; });



var APP_ROUTES = [
    { path: '', component: __WEBPACK_IMPORTED_MODULE_1__map_map_component__["a" /* MapComponent */] },
    { path: 'donor/:link', component: __WEBPACK_IMPORTED_MODULE_2__donor_donor_component__["a" /* DonorComponent */] },
];
var routing = __WEBPACK_IMPORTED_MODULE_0__angular_router__["a" /* RouterModule */].forRoot(APP_ROUTES);
//# sourceMappingURL=/Users/champact/Desktop/Development/crossover/blooddo/Code/blooddoClient/src/app.routing.js.map

/***/ }),

/***/ 534:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_Donor__ = __webpack_require__(529);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DonorFormGroupsComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var DonorFormGroupsComponent = (function () {
    function DonorFormGroupsComponent() {
        this.donor = new __WEBPACK_IMPORTED_MODULE_1__models_Donor__["a" /* Donor */]('', '', '', '', 'O+', 0, 0, '', '', 0, 0);
    }
    DonorFormGroupsComponent.prototype.extendDonorData = function (data) {
        this.donor.address = data.address || this.donor.address;
        this.donor.lat = data.lat || this.donor.lat;
        this.donor.lon = data.lon || this.donor.lon;
        this.donor.ip = data.ip || this.donor.ip;
        this.donor.x = data.x || this.donor.x;
        this.donor.y = data.y || this.donor.y;
        this.donor.firstName = data.firstName || this.donor.firstName;
        this.donor.lastName = data.lastName || this.donor.lastName;
        this.donor.contactNumber = data.contactNumber || this.donor.contactNumber;
        this.donor.email = data.email || this.donor.email;
        this.donor.bloodGroup = data.bloodGroup || this.donor.bloodGroup;
    };
    DonorFormGroupsComponent.prototype.cleanDonorData = function () {
        this.donor = new __WEBPACK_IMPORTED_MODULE_1__models_Donor__["a" /* Donor */]('', '', '', '', 'O+', 0, 0, '', '', 0, 0);
    };
    DonorFormGroupsComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'donor-form-groups',
            template: __webpack_require__(717),
            styles: [__webpack_require__(712)]
        }), 
        __metadata('design:paramtypes', [])
    ], DonorFormGroupsComponent);
    return DonorFormGroupsComponent;
}());
//# sourceMappingURL=/Users/champact/Desktop/Development/crossover/blooddo/Code/blooddoClient/src/donor-form-groups.component.js.map

/***/ }),

/***/ 535:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FooterComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var FooterComponent = (function () {
    function FooterComponent() {
    }
    FooterComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-footer',
            styles: ["\n      footer {\n          padding: 1em;\n          color: white;\n          background-color: black;\n          clear: left;\n          text-align: center;\n      }\n  "],
            template: "\n  <footer>Made by Konsta for Crossover</footer>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], FooterComponent);
    return FooterComponent;
}());
//# sourceMappingURL=/Users/champact/Desktop/Development/crossover/blooddo/Code/blooddoClient/src/footer.component.js.map

/***/ }),

/***/ 536:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HeaderComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var HeaderComponent = (function () {
    function HeaderComponent() {
    }
    HeaderComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'app-header',
            styles: ["\n      header {\n          padding: 1em;\n          color: white;\n          background-color: black;\n          clear: left;\n          text-align: center;\n      }\n  "],
            template: "\n  <header>\n     <h1>Welcome to Blooddo Service</h1>\n  </header>\n  "
        }), 
        __metadata('design:paramtypes', [])
    ], HeaderComponent);
    return HeaderComponent;
}());
//# sourceMappingURL=/Users/champact/Desktop/Development/crossover/blooddo/Code/blooddoClient/src/header.component.js.map

/***/ }),

/***/ 537:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_Report__ = __webpack_require__(530);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__services_blooddo_service__ = __webpack_require__(155);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(156);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NewDonorPopupComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var NewDonorPopupComponent = (function () {
    function NewDonorPopupComponent(blooddo) {
        this.blooddo = blooddo;
        this.report = new __WEBPACK_IMPORTED_MODULE_1__models_Report__["a" /* Report */](-1, {});
    }
    NewDonorPopupComponent.prototype.showNewDonorForm = function (data) {
        this.address = data.address;
        this.donorFormGroupsEl.extendDonorData(data);
        document.getElementById("donorForm").style.display = "block";
    };
    NewDonorPopupComponent.prototype.hideNewDonorForm = function () {
        document.getElementById("donorForm").style.display = "none";
    };
    NewDonorPopupComponent.prototype.cancelNewDonor = function () {
        this.hideNewDonorForm();
        this.donorFormGroupsEl.cleanDonorData();
    };
    NewDonorPopupComponent.prototype.submitNewDonor = function () {
        var that = this;
        if (this.donorFormGroupsEl.donor.verify() === null) {
            this.blooddo.postDonor(this.donorFormGroupsEl.donor.getJSON())
                .subscribe(function (response) {
                if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].logging)
                    console.log('Response: ' + JSON.stringify(response));
                that.hideNewDonorForm();
                that.reportPostDonor(response);
            }, function (error) {
                if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].logging)
                    console.log('Response error: ' + error);
                that.donorFormGroupsEl.donor.warn = 'Can not post a new donor. Please fill in the correct data';
            });
        }
    };
    NewDonorPopupComponent.prototype.reportPostDonor = function (response) {
        if (response && response.link) {
            this.report.data.message = 'Congrats you posted a new donor!';
            this.report.data.link = 'donor/' + response.link;
            this.report.code = 0; // success
        }
        else {
            this.report.data.message = 'Sorry, could not post a new donor';
            this.report.code = 1; // failed
        }
        this.showMessagePopup();
    };
    NewDonorPopupComponent.prototype.closeMessage = function () {
        document.getElementById("messagePopup").style.display = "none";
    };
    NewDonorPopupComponent.prototype.showMessagePopup = function () {
        document.getElementById("messagePopup").style.display = "block";
    };
    __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('donorFormGroups'), 
        __metadata('design:type', Object)
    ], NewDonorPopupComponent.prototype, "donorFormGroupsEl", void 0);
    NewDonorPopupComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'new-donor-popup',
            template: __webpack_require__(719),
            styles: [__webpack_require__(714)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__services_blooddo_service__["a" /* BlooddoService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__services_blooddo_service__["a" /* BlooddoService */]) === 'function' && _a) || Object])
    ], NewDonorPopupComponent);
    return NewDonorPopupComponent;
    var _a;
}());
//# sourceMappingURL=/Users/champact/Desktop/Development/crossover/blooddo/Code/blooddoClient/src/new-donor-popup.component.js.map

/***/ }),

/***/ 710:
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ 711:
/***/ (function(module, exports) {

module.exports = ".p {\n  font-size: 18px;\n}\n\n.title {\n  padding: 1em;\n  color: white;\n  background-color: black;\n  clear: left;\n  text-align: center;\n}\n\n/* centralized div */\n.centralized {\n  margin: 0 auto; text-align: center;\n}\n/* table */\n.div-table {\n  margin-left: auto;\n  margin-right: auto;\n  display: table;\n  width: auto;\n  background-color: #eee;\n  border: 1px solid #666666;\n  border-spacing: 5px; /* cellspacing:poor IE support for  this */\n}\n.div-table-row {\n  display: table-row;\n  width: auto;\n  clear: both;\n}\n.div-table-col {\n  float: left; /* fix for  buggy browsers */\n  display: table-column;\n  width: 200px;\n  background-color: #ccc;\n}\n\n/* modal */\n\n.modal {\n    display: none; /* Hidden by default */\n    position: fixed; /* Stay in place */\n    z-index: 1; /* Sit on top */\n    padding-top: 100px; /* Location of the box */\n    left: 0;\n    top: 0;\n    width: 100%; /* Full width */\n    height: 100%; /* Full height */\n    overflow: auto; /* Enable scroll if needed */\n    background-color: rgb(0,0,0); /* Fallback color */\n    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */\n}\n\n/* Modal Content */\n.modal-content {\n    background-color: #fefefe;\n    margin: auto;\n    padding: 20px;\n    border: 1px solid #888;\n    width: 80%;\n}\n\n/* The Close Button */\n.close {\n    color: #aaaaaa;\n    float: right;\n    font-size: 18px;\n    font-weight: bold;\n}\n\n.close:hover,\n.close:focus {\n    color: #000;\n    text-decoration: none;\n    cursor: pointer;\n}\n\n\n/* Button */\n.btn {\n    border: none; /* Remove borders */\n    color: white; /* Add a text color */\n    padding: 14px 28px; /* Add some padding */\n    cursor: pointer; /* Add a pointer cursor on mouse-over */\n}\n\n.success {background-color: #4CAF50;} /* Green */\n.success:hover {background-color: #46a049;}\n\n.info {background-color: #2196F3;} /* Blue */\n.info:hover {background: #0b7dda;}\n\n.warning {background-color: #ff9800;} /* Orange */\n.warning:hover {background: #e68a00;}\n\n.danger {background-color: #f44336;} /* Red */\n.danger:hover {background: #da190b;}\n\n.default {background-color: #e7e7e7; color: black;} /* Gray */\n.default:hover {background: #ddd;}\n\n.alert {\n    padding: 20px;\n    background-color: #f44336; /* Red */\n    color: white;\n    margin-bottom: 15px;\n}\n\n/* Button */\n.btn {\n    border: none; /* Remove borders */\n    color: white; /* Add a text color */\n    padding: 14px 28px; /* Add some padding */\n    cursor: pointer; /* Add a pointer cursor on mouse-over */\n    font-size: 18px;\n}\n"

/***/ }),

/***/ 712:
/***/ (function(module, exports) {

module.exports = ".p {\n  font-size: 18px;\n}\ninput[type=\"text\"] {\n  display: block;\n  margin: 0;\n  width: 100%;\n  font-family: sans-serif;\n  font-size: 18px;\n  -webkit-appearance: none;\n     -moz-appearance: none;\n          appearance: none;\n  box-shadow: none;\n  border-radius: none;\n}\ninput[type=\"text\"]:focus {\n  outline: none;\n}\nselect {\n  margin: 0;\n  font-size: 18px;\n  background: transparent;\n  height: 29px;\n  padding: 5px;\n  width: 268px;\n}\n\n.alert {\n  color: red\n}\n"

/***/ }),

/***/ 713:
/***/ (function(module, exports) {

module.exports = "/* import the required JSAPI css */\n@import 'https://js.arcgis.com/4.3/esri/css/main.css';\n\n.esri-view {\n    height: 500px;\n    border: 3px solid;\n}\n\n.loading {\n    height: 500px;\n    text-align: center;\n    border: 3px solid;\n}\n\n.border {\n    border: 3px solid;\n}\n\ndiv#left {\n    float: left;\n    max-width: 160px;\n    margin: 0;\n    padding: 1em;\n}\n\ndiv#right {\n    margin-left: 170px;\n    padding: 1em;\n    overflow: hidden;\n}\n\n/* switch */\n.onoffswitch {\n    position: relative; width: 171px;\n    -webkit-user-select:none; -moz-user-select:none; -ms-user-select: none;\n}\n.onoffswitch-checkbox {\n    display: none;\n}\n.onoffswitch-label {\n    display: block; overflow: hidden; cursor: pointer;\n    border: 2px solid #999999; border-radius: 6px;\n}\n.onoffswitch-inner {\n    display: block; width: 200%; margin-left: -100%;\n    transition: margin 0.3s ease-in 0s;\n}\n.onoffswitch-inner:before, .onoffswitch-inner:after {\n    display: block; float: left; width: 50%; height: 65px; padding: 0; line-height: 65px;\n    font-size: 22px; color: white; font-family: Trebuchet, Arial, sans-serif; font-weight: bold;\n    box-sizing: border-box;\n}\n.onoffswitch-inner:before {\n    content: \"DONOR\";\n    padding-left: 8px;\n    background-color: #D9033C; color: #FFFFFF;\n}\n.onoffswitch-inner:after {\n    content: \"PATIENT\";\n    padding-right: 8px;\n    background-color: #039E18; color: #FFFFFF;\n    text-align: right;\n}\n.onoffswitch-switch {\n    display: block; width: 21px; margin: 22px;\n    background: #FFFFFF;\n    position: absolute; top: 0; bottom: 0;\n    right: 102px;\n    border: 2px solid #999999; border-radius: 6px;\n    transition: all 0.3s ease-in 0s;\n}\n.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-inner {\n    margin-left: 0;\n}\n.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-switch {\n    right: 0px;\n}\n"

/***/ }),

/***/ 714:
/***/ (function(module, exports) {

module.exports = ".title {\n  padding: 1em;\n  color: white;\n  background-color: black;\n  clear: left;\n  text-align: center;\n}\n/* modal */\n\n.modal {\n    display: none; /* Hidden by default */\n    position: fixed; /* Stay in place */\n    z-index: 1; /* Sit on top */\n    padding-top: 100px; /* Location of the box */\n    left: 0;\n    top: 0;\n    width: 100%; /* Full width */\n    height: 100%; /* Full height */\n    overflow: auto; /* Enable scroll if needed */\n    background-color: rgb(0,0,0); /* Fallback color */\n    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */\n}\n\n/* Modal Content */\n.modal-content {\n    background-color: #fefefe;\n    margin: auto;\n    padding: 20px;\n    border: 1px solid #888;\n    width: 30%;\n}\n\n/* The Close Button */\n.close {\n    color: #aaaaaa;\n    float: right;\n    font-size: 18px;\n    font-weight: bold;\n}\n\n.close:hover,\n.close:focus {\n    color: #000;\n    text-decoration: none;\n    cursor: pointer;\n}\n\n\n/* Button */\n.btn {\n    border: none; /* Remove borders */\n    color: white; /* Add a text color */\n    padding: 14px 28px; /* Add some padding */\n    cursor: pointer; /* Add a pointer cursor on mouse-over */\n    font-size: 18px;\n}\n\n.success {background-color: #4CAF50;} /* Green */\n.success:hover {background-color: #46a049;}\n\n.info {background-color: #2196F3;} /* Blue */\n.info:hover {background: #0b7dda;}\n\n.warning {background-color: #ff9800;} /* Orange */\n.warning:hover {background: #e68a00;}\n\n.danger {background-color: #f44336;} /* Red */\n.danger:hover {background: #da190b;}\n\n.default {background-color: #e7e7e7; color: black;} /* Gray */\n.default:hover {background: #ddd;}\n\n/* The alert message box */\n.alert {\n    padding: 20px;\n    background-color: #f44336; /* Red */\n    color: white;\n    margin-bottom: 15px;\n}\n\n/* The close button */\n.closebtn {\n    margin-left: 15px;\n    color: white;\n    font-weight: bold;\n    float: right;\n    font-size: 18px;\n    line-height: 20px;\n    cursor: pointer;\n    transition: 0.3s;\n}\n\n/* When moving the mouse over the close button */\n.closebtn:hover {\n    color: black;\n}\n"

/***/ }),

/***/ 715:
/***/ (function(module, exports) {

module.exports = "<app-header></app-header>\n\n<router-outlet></router-outlet>\n\n<app-footer></app-footer>\n"

/***/ }),

/***/ 716:
/***/ (function(module, exports) {

module.exports = "<div style=\"height:500px\">\n  <h2 *ngIf=\"!deleted\" style=\"text-align: center\">\n    Welcome to the donor's corner. Here you'll find editable data concerning your posting.\n  </h2>\n  <h2 *ngIf=\"deleted\" style=\"text-align: center\">\n    Donor posting {{link}} has been deleted\n  </h2>\n  <div *ngIf=\"deleted\" class=\"centralized\">\n    <button class=\"btn default\" (click)=\"home()\">Home</button>\n  </div>\n  <div *ngIf=\"alert\" class=\"centralized alert\" style=\"width:50%\">\n      <strong>Attention!</strong> {{alert}}\n  </div>\n\n  <div *ngIf=\"!editing && !deleted && donorData\">\n\n    <div class=\"div-table\">\n          <div class=\"div-table-row\">\n            <div class=\"div-table-col\">First name</div>\n            <div class=\"div-table-col\">{{donorData?.firstName}}</div>\n          </div>\n          <div class=\"div-table-row\">\n            <div class=\"div-table-col\">Last name</div>\n            <div class=\"div-table-col\">{{donorData?.lastName}}</div>\n          </div>\n          <div class=\"div-table-row\">\n            <div class=\"div-table-col\">Contact number</div>\n            <div class=\"div-table-col\">{{donorData?.contactNumber}}</div>\n          </div>\n          <div class=\"div-table-row\">\n            <div class=\"div-table-col\">Email</div>\n            <div class=\"div-table-col\">{{donorData?.email}}</div>\n          </div>\n          <div class=\"div-table-row\">\n            <div class=\"div-table-col\">Blood group</div>\n            <div class=\"div-table-col\">{{donorData?.bloodGroup}}</div>\n          </div>\n          <div class=\"div-table-row\">\n            <div class=\"div-table-col\">Address</div>\n            <div class=\"div-table-col\">{{donorData?.address}}</div>\n          </div>\n          <div class=\"div-table-row\">\n            <div class=\"div-table-col\">IP at the time of posting</div>\n            <div class=\"div-table-col\">{{donorData?.ip}}</div>\n          </div>\n    </div>\n    <br />\n    <div class=\"centralized\">\n      <button class=\"btn success\" (click)=\"edit()\">Edit</button>\n      <button class=\"btn default\" (click)=\"deleteDonor()\">Delete donor's position</button>\n    </div>\n  </div>\n\n  <div id=\"edit\" style=\"border: 1px solid; margin-left: auto; margin-right: auto; display:none; padding: 20px; width:50%\">\n      <p class=\"title\">Please edit the donor's data</p>\n      <br />\n      <donor-form-groups #donorFormGroups></donor-form-groups>\n      <br /><br />\n\n      <div class=\"centralized\">\n        <button class=\"btn success\" (click)=\"updateDonor()\">Update</button>\n        <button class=\"btn default\" (click)=\"cancelDonor()\">Cancel</button>\n      </div>\n  </div>\n</div>\n"

/***/ }),

/***/ 717:
/***/ (function(module, exports) {

module.exports = "<div class=\"form-group\">\n  <label for=\"firstName\">First name</label>\n  <input type=\"text\" class=\"form-control\" id=\"firstName\"\n         required\n         pattern=\"[a-zA-Z][a-zA-Z ]+\"\n         [(ngModel)]=\"donor.firstName\" name=\"firstName\"\n         #firstName=\"ngModel\">\n  <div [hidden]=\"firstName.valid || firstName.pristine\"\n       class=\"alert alert-danger\">\n        <div [hidden]=\"!firstName.hasError('required')\">First name is required</div>\n    <div [hidden]=\"!firstName.hasError('pattern')\">Only alphabets allowed</div>\n  </div>\n</div>\n\n<div class=\"form-group\">\n  <label for=\"lastName\">Last name</label>\n  <input type=\"text\" class=\"form-control\" id=\"lastName\"\n         required\n         pattern=\"[a-zA-Z][a-zA-Z ]+\"\n         [(ngModel)]=\"donor.lastName\" name=\"lastName\"\n         #lastName=\"ngModel\">\n  <div [hidden]=\"lastName.valid || lastName.pristine\"\n       class=\"alert alert-danger\">\n        <div [hidden]=\"!lastName.hasError('required')\">Last name is required</div>\n    <div [hidden]=\"!lastName.hasError('pattern')\">Only alphabets allowed</div>\n  </div>\n</div>\n\n<div class=\"form-group\">\n  <label for=\"contactNumber\">Phone</label>\n  <input type=\"text\" class=\"form-control\" id=\"contactNumber\"\n         required\n         pattern=\"(?:\\b|[+])[0-9]*(?:\\b|[_\\s])[0-9]*(?:\\b|[_\\s])[0-9]*(?:\\b|[_\\s])[0-9]*\"\n         minlength=\"5\"\n         [(ngModel)]=\"donor.contactNumber\" name=\"contactNumber\"\n         #contactNumber=\"ngModel\">\n  <div [hidden]=\"contactNumber.valid || contactNumber.pristine\"\n       class=\"alert alert-danger\">\n       <div [hidden]=\"!contactNumber.hasError('minlength')\">Phone should be > 5digit</div>\n       <div [hidden]=\"!contactNumber.hasError('required')\">Phone is required</div>\n       <div [hidden]=\"!contactNumber.hasError('pattern')\">Phone numberr should be only numbers, spaces and optionally leading. Phone format: <small><b>+xx xxx xxxx xxx | 00xx xxx xxxx xxx</b></small></div>\n\n  </div>\n</div>\n\n<div class=\"form-group\">\n  <label for=\"email\">Email</label>\n  <input type=\"text\" class=\"form-control\" id=\"email\"\n         required\n         pattern=\"^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$\"\n         [(ngModel)]=\"donor.email\" name=\"email\"\n         #email=\"ngModel\">\n  <div [hidden]=\"email.valid || email.pristine\"\n       class=\"alert alert-danger\">\n       <div [hidden]=\"!email.hasError('required')\">Email is required</div>\n       <div [hidden]=\"!email.hasError('pattern')\">Email format should be <small><b>info@abc.com</b></small></div>\n  </div>\n</div>\n<br />\n<div class=\"form-group\">\n  <label for=\"bloodGroup\">Blood group</label>\n  <select [(ngModel)]=\"donor.bloodGroup\">\n    <option selected value=\"O+\">O+</option>\n    <option value=\"O-\">O-</option>\n    <option value=\"A+\">A+</option>\n    <option value=\"A-\">A-</option>\n    <option value=\"B+\">B+</option>\n    <option value=\"B-\">B-</option>\n    <option value=\"AB+\">AB+</option>\n    <option value=\"AB-\">AB-</option>\n  </select>\n</div>\n\n<div *ngIf=\"donor.warn != null\" class=\"alert\">\n  <span class=\"closebtn\" (click)=\"donor.warn=null;\">&times;</span>\n  {{donor.warn}}\n</div>\n"

/***/ }),

/***/ 718:
/***/ (function(module, exports) {

module.exports = "<div class=\"border\">\n  <div id=\"left\">\n    <div class=\"onoffswitch\">\n        <input type=\"checkbox\" name=\"onoffswitch\" [(ngModel)]=\"donor\" class=\"onoffswitch-checkbox\" id=\"myonoffswitch\" (change)=\"onSwitchChange()\" checked>\n        <label class=\"onoffswitch-label\" for=\"myonoffswitch\">\n            <span class=\"onoffswitch-inner\"></span>\n            <span class=\"onoffswitch-switch\"></span>\n        </label>\n    </div>\n    <p *ngIf=\"donor\">\n      If you want to become a donor, just find your location on the map, click on it and submit the form.\n    </p>\n    <p *ngIf=\"!donor\">\n      Please you the map to find locations of donors. Go get more information about a donor just click on its mark. \n    </p>\n  </div>\n\n  <div id=\"right\">\n    <div *ngIf=\"loading\" class=\"loading\">\n      <h1>Loading map ...</h1>\n    </div>\n    <div #mapViewNode></div>\n  </div>\n  <new-donor-popup #newDonorPopup></new-donor-popup>\n</div>\n"

/***/ }),

/***/ 719:
/***/ (function(module, exports) {

module.exports = "<div id=\"donorForm\" class=\"modal\">\n  <div class=\"modal-content\">\n    <span class=\"close\" (click)=\"cancelNewDonor()\" >&times;</span>\n    <br /><p class=\"title\">You want to register a donor for adress {{address}}</p>\n    <p>Please extend your data</p>\n    <br />\n\n    <donor-form-groups #donorFormGroups></donor-form-groups>\n\n    <br />\n    <button class=\"btn success\" (click)=\"submitNewDonor()\">Submit</button>\n    <button class=\"btn default\" (click)=\"cancelNewDonor()\">Cancel</button>\n  </div>\n</div>\n\n<div id=\"messagePopup\" class=\"modal\">\n  <div class=\"modal-content\">\n    <span class=\"close\" (click)=\"closeMessage()\" >&times;</span>\n    <br /><p class=\"title\">Message</p>\n    <p>{{report.data.message}}</p>\n    <div *ngIf=\"report.code === 0\">\n      Use this <a target=\"_blank\" href=\"{{report.data.link}}\">link</a> to view/edit your posting.\n    </div>\n    <br />\n    <button class=\"btn default\" (click)=\"closeMessage()\">Close</button>\n  </div>\n</div>\n"

/***/ }),

/***/ 748:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 749:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(412);


/***/ })

},[749]);
//# sourceMappingURL=main.bundle.map