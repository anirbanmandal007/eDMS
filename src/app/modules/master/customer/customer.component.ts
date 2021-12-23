import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { ToasterService } from 'app/shared/toaster/toaster.service';
import { MasterService } from '../master.service';
import { ConfirmationDialogComponent, ConfirmDialogModel } from 'app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {

  @ViewChild('openmenu') toggleButton: ElementRef;
  @ViewChild('data-menu') menu: ElementRef;
  dataSource: any;
  loader: boolean;
  displayTable: boolean;
  dtOptions: any;
  selectedId: any;
  openlist: boolean = false;
  _CutomerList :any; 
  CustomerForm: FormGroup;

  createmodalopen:boolean = false; 
  _PageTitle:any = "Add new customer";
  _toasterTitle:any = "Added";
  constructor(
    private toaster: ToasterService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _masterService: MasterService
  ) {}

  ngOnInit(): void {
    this.loader = false;
    this.CustomerForm = this._formBuilder.group({
      BranchName: ["", Validators.required],
      id:[0]
    });
    this.geCustomerList();
  }
  openMenu(id:any){
    this.selectedId = id;
    this.openlist = true;
  }
  /*Get all the customer list */
  geCustomerList() {
    this.loader =true;
    this._masterService.getCustomerListData().subscribe((data: {}) => {     
    this._CutomerList = data;
    console.log(this._CutomerList);
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
    return this.CustomerForm.controls;
  }
  /*Create new customer */
  createCustomer(){
    this._PageTitle = "Add new customer";
    this._toasterTitle ="Added!";
    this.createmodalopen=true;
    this.CustomerForm = this._formBuilder.group({
      BranchName: ["", Validators.required],
      id:[0]
    });
   }
   /*Edit customer*/
   editCustomer(customer:any) {
    this._toasterTitle = "Updated!";
    this._PageTitle = "Edit customer";
    this.CustomerForm = this._formBuilder.group({
      BranchName: [customer.BranchName, Validators.required],
      id:customer.id
    });
    this.createmodalopen=true;
  }
  /* Create and update the customer*/
  customerUpdate(){
    console.log('Form data:' + JSON.stringify(this.CustomerForm.value));
    console.log(this.CustomerForm.value);

    this._masterService.addUpdateCustomerAPI(this.CustomerForm.value).subscribe(data => {
    this.toaster.show('success', this._toasterTitle, data);
    this.openlist = false;
    this.createmodalopen = false;
    this.geCustomerList();
    });
  }
  /*Delete Customer */
  deleteCustomer(customerId:any,BranchName:any){
    const message = `Are you sure you want delete this Customer: `+BranchName+`?`;
    const dialogData = new ConfirmDialogModel("Confirm Deletion", message, 'Delete', 'Cancel');

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: "0",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult) {
      this.deleteCustomerData(customerId);
      } else {
      }
    });
  }
  deleteCustomerData(customerId:any){
  let data = {
    "id":customerId
  };
  this._masterService.deleteCustomerAPI(data).subscribe(data => {
    this.toaster.show('warning', 'Deleted!', data);
    this.geCustomerList();
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
