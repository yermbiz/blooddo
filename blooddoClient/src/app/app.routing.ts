import {Routes, RouterModule} from '@angular/router';

import { MapComponent } from './map/map.component';
import { DonorComponent } from './donor/donor.component';

const APP_ROUTES: Routes = [
  {path : '' , component: MapComponent},
  {path : 'donor/:link' , component: DonorComponent},
];

export const routing = RouterModule.forRoot(APP_ROUTES);
