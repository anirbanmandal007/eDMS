import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { ToasterService } from 'app/shared/toaster/toaster.service';
import { MasterService } from '../master.service';
import { ConfirmationDialogComponent, ConfirmDialogModel } from 'app/shared/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-template-mapping',
  templateUrl: './template-mapping.component.html',
  styleUrls: ['./template-mapping.component.scss']
})
export class TemplateMappingComponent implements OnInit {

  @ViewChild('openmenu') toggleButton: ElementRef;
  @ViewChild('data-menu') menu: ElementRef;

  dataSource: any;
  loader:boolean;
  displayTable: boolean;
    selectedId: any;
  openlist: boolean = false;
  _TemplateList :any; 
  _UserL:any;
  TemplateMappingForm: FormGroup;
  AddTemplateMappingForm: FormGroup;

  createmodalopen:boolean = false; 
  _PageTitle:any = "New Template Mapping";
  _toasterTitle:any = "Mapped!";
  dtOptions:any = {
    processing: true,
    ordering: true,
    info: false,
    searching: true,
    paging: true,
    pageLength:10
  }
  constructor(
    private toaster: ToasterService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _masterService: MasterService
  ) {}

  ngOnInit(): void {
    this.loader = false;

    this.AddTemplateMappingForm = this._formBuilder.group({
      UserID: [0, Validators.required],
    });
    this.TemplateMappingForm = this._formBuilder.group({
      UserIDS: ["", Validators.required],
    });
    this.getUserList();
    this.getCustomerWiseTemplateList(0);
  }
  openMenu(id:any){
    this.selectedId = id;
    this.openlist = true;
  }
  /** Get user List */
  getUserList() {
    this._masterService.getUserListAPI().subscribe((data: {}) => {
      this._UserL = data;
      this.AddTemplateMappingForm.controls["UserID"].setValue(0);
      this.TemplateMappingForm.controls["UserIDS"].setValue(0);
    });
  }
  getUserWiseTemplateList(userid: number){
    this._masterService.getUserWiseTemplateList(userid).subscribe((data: {}) => {
      this._UserL = data;
      this.AddTemplateMappingForm.controls["UserID"].setValue(0);
      this.TemplateMappingForm.controls["UserIDS"].setValue(0);
    });
  }
  getCustomerListByUserID(userid: number) {
    this.getCustomerWiseTemplateList(userid);
  }
  /*Get all the customerWise template list */
  getCustomerWiseTemplateList(userId:any) {
    this.loader = true;
    //this._TemplateList =[];
    this._masterService.getCustomerWiseTemplateListAPI(userId).subscribe((data: {}) => {     
    this._TemplateList = data;
    console.log(this._TemplateList);
    
    this.displayTable = true;
    this.loader = false;
    });
  }
  get tf(){
    return this.AddTemplateMappingForm.controls;
  }
  /*Create Customer Mapping */
  createCustomerMapping(){
    this._PageTitle = "New Template Mapping";
    this._toasterTitle ="Mapped!";
    this.createmodalopen=true;
    this.getUserList();
    this.TemplateMappingForm = this._formBuilder.group({
     // TemplateName: ["", Validators.required],
      //id:[0]
    });
   }
   /*Edit template*/
  editTemplate(template:any) {
    this._toasterTitle = "Updated!";
    this._PageTitle = "Edit template";
    this.TemplateMappingForm = this._formBuilder.group({
   // TemplateName: [template.TemplateName, Validators.required],
    //id:template.id
    });
    this.createmodalopen=true;
  }
  /* Create and update the template*/
  templateUpdate(){
    console.log('Form data:' + JSON.stringify(this.TemplateMappingForm.value));
    console.log(this.TemplateMappingForm.value);

    this._masterService.addUpdateTemplateAPI(this.TemplateMappingForm.value).subscribe(data => {
    this.toaster.show('success', this._toasterTitle, data);
    this.openlist = false;
    this.createmodalopen = false;
    this.getCustomerWiseTemplateList(0);
    });
  }
  /*Delete template */
  deleteTemplate(templateId:any,templateName:any){
    const message = `Are you sure you want delete this Template: `+templateName+`?`;
    const dialogData = new ConfirmDialogModel("Confirm Deletion", message, 'Delete', 'Cancel');

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: "0",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult) {
      this.deleteTemplateData(templateId);
      } else {
      }
    });
  }
  deleteTemplateData(templateId:any){
  let data = {
    "id":templateId
  };
  this._masterService.deleteTemplateAPI(data).subscribe(data => {
    this.toaster.show('warning', 'Deleted!', data);
    this.getCustomerWiseTemplateList(0);
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
