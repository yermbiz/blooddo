import { Component, Directive, forwardRef, Attribute,OnChanges, SimpleChanges,Input, ViewChild, ElementRef } from '@angular/core';

import { Report } from '../_models/Report';
import { BlooddoService } from '../_services/blooddo.service';

import { environment } from '../../environments/environment';

@Component({
  moduleId: module.id,
  selector: 'new-donor-popup',
  templateUrl: './new-donor-popup.component.html',
  styleUrls: ['./new-donor-popup.component.css']
})
export class NewDonorPopupComponent {
  report = new Report(-1,{});
  address;
  @ViewChild('donorFormGroups') private donorFormGroupsEl;

  constructor(
    private blooddo: BlooddoService
  ) { }

  public showNewDonorForm(data: any) {
    this.address = data.address;
    this.donorFormGroupsEl.cleanDonorData();
    this.donorFormGroupsEl.extendDonorData(data);
    document.getElementById("donorForm").style.display = "block";
  }

  hideNewDonorForm() {
    document.getElementById("donorForm").style.display = "none";
  }

  cancelNewDonor() {
    this.hideNewDonorForm();
    this.donorFormGroupsEl.cleanDonorData();
  }

  submitNewDonor() {
    let that = this;
    if (this.donorFormGroupsEl.donor.verify() === null) {

      this.blooddo.postDonor(this.donorFormGroupsEl.donor.getJSON())
          .subscribe(
            (response) => {
              if (environment.logging) console.log('Response: '+JSON.stringify(response));
              that.hideNewDonorForm();
              that.reportPostDonor(response);
            },
            (error) =>  {
              if (environment.logging) console.log('Response error: '+error);

              that.donorFormGroupsEl.donor.warn = 'Can not post a new donor. Please fill in the correct data';
            });
    }

  }


  reportPostDonor(response) {

    if (response && response.link) {
      this.report.data.message = 'Congrats you posted a new donor!';
      this.report.data.link = 'donor/'+response.link;
      this.report.code = 0; // success
    } else {
      this.report.data.message = 'Sorry, could not post a new donor';
      this.report.code = 1; // failed
    }
    this.showMessagePopup();
  }

  closeMessage() {
    document.getElementById("messagePopup").style.display = "none";
  }

  showMessagePopup() {
    document.getElementById("messagePopup").style.display = "block";
  }
}
