import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { JsonpModule } from '@angular/http';

import { EsriLoaderService } from 'angular2-esri-loader';
import { BlooddoService } from './_services/blooddo.service';
import { LocationService } from './_services/location.service';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DonorComponent } from './donor/donor.component';
import { MapComponent } from './map/map.component';
import { NewDonorPopupComponent } from './newDonorPopup/new-donor-popup.component';
import { DonorFormGroupsComponent } from './donorFormGroups/donor-form-groups.component';

import {routing} from './app.routing';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MapComponent,
    DonorComponent,
    NewDonorPopupComponent,
    DonorFormGroupsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    routing
  ],
  providers: [EsriLoaderService, BlooddoService, LocationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
