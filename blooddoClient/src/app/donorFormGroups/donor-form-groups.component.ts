import { Component, Directive, forwardRef, Attribute,OnChanges, SimpleChanges,Input } from '@angular/core';
import { NG_VALIDATORS,Validator,Validators,AbstractControl,ValidatorFn } from '@angular/forms';

import { Donor } from '../_models/Donor';

@Component({
  moduleId: module.id,
  selector: 'donor-form-groups',
  templateUrl: './donor-form-groups.component.html',
  styleUrls: ['./donor-form-groups.component.css']
})
export class DonorFormGroupsComponent {
  donor = new Donor('','', '', '', 'O+', 0, 0, '', '', 0, 0);

  public extendDonorData(data: any) {

    this.donor.address = data.address || this.donor.address;
    this.donor.lat = data.lat || this.donor.lat;
    this.donor.lon = data.lon || this.donor.lon;
    this.donor.ip = data.ip || this.donor.ip;
    this.donor.x = data.x || this.donor.x;
    this.donor.y = data.y || this.donor.y;
    this.donor.firstName = data.firstName || this.donor.firstName
    this.donor.lastName = data.lastName || this.donor.lastName;
    this.donor.contactNumber = data.contactNumber || this.donor.contactNumber;
    this.donor.email = data.email || this.donor.email;
    this.donor.bloodGroup = data.bloodGroup || this.donor.bloodGroup;
  }

  cleanDonorData() {
    this.donor = new Donor('','', '', '', 'O+', 0, 0, '', '', 0, 0);
  }

}
