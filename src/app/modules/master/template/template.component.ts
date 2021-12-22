import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { ToasterService } from 'app/shared/toaster/toaster.service';
import { MasterService } from '../master.service';
import { ConfirmationDialogComponent, ConfirmDialogModel } from 'app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
  @ViewChild('openmenu') toggleButton: ElementRef;
  @ViewChild('data-menu') menu: ElementRef;
  dataSource: any;
  displayTable: boolean;
  dtOptions: any;
  selectedId: any;
  openlist: boolean = false;
  _TemplateList :any; 
  TemplateForm: FormGroup;

  createmodalopen:boolean = false; 
  _PageTitle:any = "Add new template";
  _toasterTitle:any = "Added";
  constructor(
    private toaster: ToasterService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _masterService: MasterService
  ) {}

  ngOnInit(): void {
    this.TemplateForm = this._formBuilder.group({
      TemplateName: ["", Validators.required],
      id:[0]
    });
    this.geTempList();
  }
  openMenu(id:any){
    this.selectedId = id;
    this.openlist = true;
  }
  /*Get all the template list */
  geTempList() {
    this._masterService.getTempListData().subscribe((data: {}) => {     
    this._TemplateList = data;
    console.log(this._TemplateList);
    this.dtOptions = {
      processing: true,
      ordering: true,
      info: false,
      searching: true,
      paging: true,
      pageLength:10
    }
    this.displayTable = true;
    });
  }
  get tf(){
    return this.TemplateForm.controls;
  }
  /*Create new template */
  createTemplate(){
    this._PageTitle = "Add new template";
    this._toasterTitle ="Added!";
    this.createmodalopen=true;
    this.TemplateForm = this._formBuilder.group({
      TemplateName: ["", Validators.required],
      id:[0]
    });
   }
   /*Edit template*/
  editTemplate(template:any) {
    this._toasterTitle = "Updated!";
    this._PageTitle = "Edit template";
    this.TemplateForm = this._formBuilder.group({
    TemplateName: [template.TemplateName, Validators.required],
    id:template.id
    });
    this.createmodalopen=true;
  }
  /* Create and update the template*/
  templateUpdate(){
    console.log('Form data:' + JSON.stringify(this.TemplateForm.value));
    console.log(this.TemplateForm.value);

    this._masterService.addUpdateTemplateAPI(this.TemplateForm.value).subscribe(data => {
    this.toaster.show('success', this._toasterTitle, data);
    this.openlist = false;
    this.createmodalopen = false;
    this.geTempList();
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
    this.toaster.show('success', 'Deleted!', data);
    this.geTempList();
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
