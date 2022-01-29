import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { ToasterService } from 'app/shared/toaster/toaster.service';
import { MasterService } from '../master.service';
import { ConfirmationDialogComponent, ConfirmDialogModel } from 'app/shared/confirmation-dialog/confirmation-dialog.component';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-customer-mapping',
  templateUrl: './customer-mapping.component.html',
  styleUrls: ['./customer-mapping.component.scss']
})
export class CustomerMappingComponent implements OnInit {

  @ViewChild('openmenu') toggleButton: ElementRef;
  @ViewChild('data-menu') menu: ElementRef;
  dataSource: any;
  loader:boolean;
  displayTable: boolean;
    selectedId: any;
  openlist: boolean = false;
  _CustomerBranchList :any; 
  _UserL:any;
  AddBranchMappingForm: FormGroup;
  BranchMappingForm: FormGroup;
  userFilter:any = { BranchName: '' };
  createmodalopen:boolean = false; 
  _PageTitle:any = "New Folder Mapping";
  _toasterTitle:any = "Access!";
  dtOptions:any = {
    processing: true,
    ordering: true,
    info: false,
    searching: true,
    paging: true,
    pageLength:10
  }
  temp: any;
  columns = [{prop: 'UserName'}, {prop: 'BranchName'}];
  @ViewChild('search', { static: false }) search: any;
  selectedItems: any = [];
  dropdownSettings:IDropdownSettings;
  largeDataset: any = [];
  maxOptions: any;
  submitted: boolean;
  __checkedList: string;
  _selectedCustId: any;
  
  constructor(
    private toaster: ToasterService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _masterService: MasterService
  ) {}

  ngOnInit(): void {
    this.loader = false;

    this.BranchMappingForm = this._formBuilder.group({
      BranchName: ["", Validators.required],
      id: [0],
      UserIDS: ['', Validators.required],
      UserID: [0, Validators.required],
    });
    this.AddBranchMappingForm = this._formBuilder.group({
      BranchName: [""],
      SelectItem: [""],
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      id: [0],
      UserID: ["", Validators.required],
      checkedList: [""],
      RootID:[0],
      checklist: this._formBuilder.array([]),
      selectAll: [false],
      DeptID: [0]
      
    });
    this.getUserList();
    this.getCustomerWiseList(0);
    
  }
  openMenu(id:any){
    this.selectedId = id;
    this.openlist = true;
  }
  /** Get user List */
  getUserList() {
    
    this._masterService.getUserListAPI().subscribe((data: {}) => {
      this._UserL = data;
      this.AddBranchMappingForm.controls["UserID"].setValue(0);
      this.BranchMappingForm.controls["UserIDS"].setValue(0);
    });
  }
  getCustomerListByUserID(userid: number) {
    this.getCustomerWiseList(userid);
  }
  /*Get all the customerWise list */
  getCustomerWiseList(userId:any) {
    this.loader = true;
    this._masterService.getCustomerWiseList(userId).subscribe((data:any) => { 
    this.temp = data;    
    this._CustomerBranchList = data;
    this._CustomerBranchList.forEach(element => {
      
      element.ischecked = false;
      this.largeDataset.push(element);
      
    });
    this.filternames(this.largeDataset);
    console.log(this.largeDataset);
    
    
    this.displayTable = true;
    this.loader = false;
    });
  }
  get tf(){
    return this.AddBranchMappingForm.controls;
  }
  /*Create Customer Mapping */
  createCustomerMapping(){
    this._PageTitle = "New Folder Access";
    this._toasterTitle ="Access!";
    this.createmodalopen=true;
    this.getUserList();
    /*this.AddBranchMappingForm = this._formBuilder.group({
      TemplateName: ["", Validators.required],
      id:[0]
    });*/
   }
   /*Edit template*/
  editTemplate(template:any) {
    this.createCustomerMapping();
    this._toasterTitle = "Updated!";
    this._PageTitle = "Edit Category";
    this.AddBranchMappingForm = this._formBuilder.group({
    TemplateName: [template.TemplateName, Validators.required],
    id:template.id
    });
    this.createmodalopen=true;
  }
  /* Create and update the template*/
  templateUpdate(){
    console.log('Form data:' + JSON.stringify(this.AddBranchMappingForm.value));
    console.log(this.AddBranchMappingForm.value);

    this._masterService.addUpdateTemplateAPI(this.AddBranchMappingForm.value).subscribe(data => {
    this.toaster.show('success', this._toasterTitle, data);
    this.openlist = false;
    this.createmodalopen = false;
    this.getCustomerWiseList(0);
    });
  }
  /*Delete template */
  deleteTemplate(templateId:any,templateName:any){
    const message = `Are you sure you want delete this Folder: `+templateName+`?`;
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
    "BranchName":"",
    "id":templateId,
    "UserIDS":this._selectedCustId
  };
  this._masterService.deleteCustomerMapping(data).subscribe(data => {
    this.toaster.show('warning', 'Deleted!', data);
    this.getCustomerWiseList(0);
    this.AddBranchMappingForm.controls["UserID"].setValue(0);
    this.BranchMappingForm.controls["UserIDS"].setValue(0);
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
ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    fromEvent(this.search.nativeElement, 'keydown')
      .pipe(
        debounceTime(550),
        map(x => x['target']['value'])
      )
      .subscribe(value => {
        this.updateFilter(value);
      });
  }

  updateFilter(val: any) {
    const value = val.toString().toLowerCase().trim();
    // get the amount of columns in the table
    const count = this.columns.length;
    // get the key names of each column in the dataset
    const keys = ['UserName', 'BranchName'];
    // assign filtered matches to the active datatable
    this._CustomerBranchList = this.temp.filter(item => {
      // iterate through each row's column data
      for (let i = 0; i < count; i++) {
        // check for a match
        if (
          (item[keys[i]] &&
            item[keys[i]]
              .toString()
              .toLowerCase()
              .indexOf(value) !== -1) ||
          !value
        ) {
          // found match, return true to add to result set
          return true;
        }
      }
    });

    // Whenever the filter changes, always go back to the first page
    // this.table.offset = 0;
  }

  //Mapping add code start

  // getting already selected items based on user id
  getCustListById(id:any){
    this._selectedCustId = id;
    this.__checkedList = "";
    this._masterService.getBranchDetails(id).subscribe((data:any) => { 
      this.largeDataset = data;
    });
  }
  selectedItem(item){
    this.selectedItems.push(item.id);
    console.log("checked item",this.selectedItems);   
  }
  onSubmit() {
    this.submitted = true;
    this.__checkedList ="";
    var _chkstatus =false;
    for (let value of this.largeDataset) {
      if (value.ischecked)
      {
        this.__checkedList +=value.id + "#";
        _chkstatus = true;
      }
    }

    let finalArray = [];
    let eachObj = {};

    for (let value of this.largeDataset) {

        if(this.selectedItems.indexOf(value.id) > -1){
          this.__checkedList +=value.id + "#";
          if(value.ischecked == 1){
            eachObj = {
              "id": value.id,
              "BranchName": value.BranchName,
              "ischecked": false
            }
          }else{
            eachObj = {
              "id": value.id,
              "TemplateName": value.TemplateName,
              "ischecked": true
            }
          } 
        }else{
          eachObj = {
            "id": value.id,
            "BranchName": value.BranchName,
            "ischecked": value.ischecked
          }
        }  
      finalArray.push(eachObj);  
    }

    let body = {
      "BranchName": "",
      "SelectItem": "",
      "id": 0,
      "UserID": this._selectedCustId,
      "checkedList": this.__checkedList,
      "checklist": finalArray,
      "selectAll": false
    }

    this._masterService.createMapping(body).subscribe((data) => {
        this.createmodalopen = false;
        this.toaster.show('success', 'Folder Access Done', data);
        this.getCustListById(this._selectedCustId);
        this.getCustomerWiseList(0);
      });

     }
     master_change(){
      let _bool =this.AddBranchMappingForm.controls['selectAll'].value;
      this.largeDataset.forEach((ele,index) => {
        if(_bool == true){
          ele.ischecked = true;
        }else
          ele.ischecked = false;
         
      });
      console.log("this.largeDataset",this.largeDataset);
     }
     filternames(mList){
        this.largeDataset = mList;
     }
     searchforBranch(key){
        if(!key){

        }
     }
    
  }
