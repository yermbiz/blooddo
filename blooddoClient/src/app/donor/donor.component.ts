  // import { Component, Directive, forwardRef, Attribute,OnChanges, SimpleChanges,Input, ViewChild, ElementRef, OnInit, AfterViewInit } from '@angular/core';
import {Component, ViewChild, AfterViewInit, OnInit} from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';

import { BlooddoService } from '../_services/blooddo.service';
import { Donor } from '../_models/Donor';

import { environment } from '../../environments/environment';

@Component({
  moduleId: module.id,
  selector: 'app-donor',
  templateUrl: './donor.component.html',
  styleUrls: ['./donor.component.css']
})
export class DonorComponent implements OnInit {

  link: string;
  editing: boolean = false;
  deleted: boolean = false;
  alert;
  public donorData = null;

  @ViewChild('donorFormGroups') private donorFormGroupsEl;

  constructor(
    private blooddo: BlooddoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  public ngOnInit() {
    let that = this;
    this.link = this.route.snapshot.params['link'];
    this.blooddo.getDonor(this.link)
        .subscribe(
          (response) => {
            if (environment.logging) console.log('Response: '+JSON.stringify(response));
            that.donorData = response;
          },
          (error) =>  {
            if (environment.logging) console.log('Response error: '+error);
            that.alert = 'Donor not found';
          });
  }

  edit() {
    this.editing = true;
    document.getElementById("edit").style.display = "block";
    this.donorFormGroupsEl.extendDonorData(this.donorData);
  }

  cancelDonor() {
    this.editing = false;
    document.getElementById("edit").style.display = "none";
  }

  deleteDonor() {
    let that = this;
    this.alert = null;
    this.blooddo.deleteDonor(this.link)
        .subscribe(
          (response) => {
            this.deleted = true;
          },
          (error) =>  {
            this.deleted = false;
            this.alert = 'Could not delete donor';
          });
  }

  updateDonor() {
    let that = this;
    this.alert = null;
    this.blooddo.updateDonor(this.link, this.donorFormGroupsEl.donor.getJSON())
        .subscribe(
          (response) => {
            if (environment.logging) console.log('Response: '+JSON.stringify(response));
            that.donorData = response;
            that.editing = false;
            document.getElementById("edit").style.display = "none";

          },
          (error) =>  {
            if (environment.logging) console.log('Response error: '+error);
            that.alert ='Upload failed!';
          });
  }

  home() {
    return this.router.navigate(['/']);
  }


}
