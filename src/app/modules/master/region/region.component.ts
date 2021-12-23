import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { ToasterService } from 'app/shared/toaster/toaster.service';
import { MasterService } from '../master.service';
import { ConfirmationDialogComponent, ConfirmDialogModel } from 'app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss']
})
export class RegionComponent implements OnInit {

 
  @ViewChild('openmenu') toggleButton: ElementRef;
  @ViewChild('data-menu') menu: ElementRef;
  dataSource: any;
  loader: boolean;
  displayTable: boolean;
  dtOptions: any;
  selectedId: any;
  openlist: boolean = false;
  _regionList :any; 
  RegionForm: FormGroup;

  createmodalopen:boolean = false; 
  _PageTitle:any = "Add new region";
  _toasterTitle:any = "Added";
  constructor(
    private toaster: ToasterService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _masterService: MasterService
  ) {}

  ngOnInit(): void {
    this.loader = false;
    this.RegionForm = this._formBuilder.group({
      DepartmentName: ["", Validators.required],
      id:[0]
    });
    this.geRegionList();
  }
  openMenu(id:any){
    this.selectedId = id;
    this.openlist = true;
  }
  /*Get all the Region list */
  geRegionList() {
    this.loader =true;
    this._masterService.getRegionListData().subscribe((data: {}) => {     
    this._regionList = data;
    console.log(this._regionList);
    this.dtOptions = {
      processing: true,
      ordering: true,
      info: false,
      searching: true,
      paging: true,
      pageLength:10
    }
    this.displayTable = true;
    this.loader=false;
    });
  }
  get tf(){
    return this.RegionForm.controls;
  }
  /*Create new region */
  createRegion(){
    this._PageTitle = "Add new region";
    this._toasterTitle ="Added!";
    this.createmodalopen=true;
    this.RegionForm = this._formBuilder.group({
      DepartmentName: ["", Validators.required],
      id:[0]
    });
   }
   /*Edit region*/
   editRegion(region:any) {
    this._toasterTitle = "Updated!";
    this._PageTitle = "Edit region";
    this.RegionForm = this._formBuilder.group({
      DepartmentName: [region.DepartmentName, Validators.required],
      id:region.DID
    });
    this.createmodalopen=true;
  }
  /* Create and update the region*/
  regionUpdate(){
    console.log('Form data:' + JSON.stringify(this.RegionForm.value));
    console.log(this.RegionForm.value);

    this._masterService.addUpdateRegionAPI(this.RegionForm.value).subscribe(data => {
    this.toaster.show('success', this._toasterTitle, data);
    this.openlist = false;
    this.createmodalopen = false;
    this.geRegionList();
    });
  }
  /*Delete region */
  deleteRegion(regionId:any,DepartmentName:any){
    const message = `Are you sure you want delete this Department: `+DepartmentName+`?`;
    const dialogData = new ConfirmDialogModel("Confirm Deletion", message, 'Delete', 'Cancel');

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: "0",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult) {
      this.deleteRegionrData(regionId);
      } else {
      }
    });
  }
  deleteRegionrData(regionId:any){
  let data = {
    "id":regionId
  };
  this._masterService.deleteRegionAPI(data).subscribe(data => {
    this.toaster.show('warning', 'Deleted!', data);
    this.geRegionList();
  });   
  }
  closeDialog(){
    this.openlist = false;
    this.createmodalopen = false;
  }
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(event.target && event.target.innerText !== 'more_vert') {
      this.openlist = false;
    }
  }

}
