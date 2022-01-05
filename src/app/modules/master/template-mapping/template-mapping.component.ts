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
  userFilter:any = { TemplateName: '' };
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

  //ng table data populate
  temp: any;
  columns = [{prop: 'UserName'}, {prop: 'TemplateName'}];
  @ViewChild('search', { static: false }) search: any;
  //multi select drop down
  selectedItems: any = [];
  dropdownSettings:IDropdownSettings;
  largeDataset: any = [];
  maxOptions: any;
  _selectedCustId: any;
  __checkedList: string;
  submitted: boolean;
  largeDatasetForMap: any;

  constructor(
    private toaster: ToasterService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _masterService: MasterService
  ) {}

  ngOnInit(): void {
    this.loader = false;
    this.AddTemplateMappingForm = this._formBuilder.group({
      TemplateID:[""],
      TemplateName: [""],
      SelectItem: [""],
      id: [0],
      UserID: ["", Validators.required],
      checkedList: [""],

      checklist: this._formBuilder.array([]),
      selectAll: [false],
    });
    this.TemplateMappingForm = this._formBuilder.group({
      TemplateName: ["", Validators.required],
      id: [0],
      UserIDS: ['', Validators.required],
      UserID: [0, Validators.required],
    });
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'TemplateID',
      textField: 'TemplateName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.getUserList();
    this.getCustomerWiseTemplateList(0);
    this.getTemplateListById(0);
  }
  openMenu(id:any){
    this.selectedId = id;
    this.openlist = true;
  }
  /** Get user List */
  getUserList() {
    this._masterService.getUserListAPI().subscribe((data: {}) => {
      this._UserL = data;
    });
  }
  getUserWiseTemplateList(userid: number){
    this._masterService.getUserWiseTemplateList(userid).subscribe((data: {}) => {
      this.largeDataset = data;
     
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
    this.temp = data;    
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
    this.getTemplatebyUser(0);
    this.TemplateMappingForm.controls["UserID"].setValue(0);
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
      "TemplateName":"",
      "id":15225,
      "UserIDS":this._selectedCustId
    };
  this._masterService.deleteTemplateMapping(data).subscribe(data => {
    this.toaster.show('warning', 'Deleted!', data);
    this.getCustomerWiseTemplateList(0);
  });   
  }
  closeDialog(){
    this.openlist = false;
    this.createmodalopen = false;
  }
  // getting already selected items based on user id
  getTemplatebyUser(id:any){
    this._masterService.getUserWiseTemplateList(id).subscribe((data:any) => { 
      this.selectedItems = data;
    });
  }
  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(event.target && event.target.innerText !== 'more_vert') {
      this.openlist = false;
    }
  }

  /* ng table data table populate */
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
  const keys = ['UserName', 'TemplateName'];
  // assign filtered matches to the active datatable
  this._TemplateList = this.temp.filter(item => {
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

 // functions for selecting items in multiselect dropdown
 onItemSelect(item: any) {
  console.log(item);
}
onSelectAll(items: any) {
  console.log(items);
}

// Function for slicing the resultset after filter
handleFilterChange(text: string): void {
  const filteredOptions = this.largeDataset.filter((option) => option.BranchName
    .toLowerCase()
    .includes(text.toLowerCase()),
  );
  // I use this.largeDataset as a fallback if no matches are found
  const optionsToShow = filteredOptions.length ? filteredOptions : this.largeDataset;

  this.largeDataset = optionsToShow.slice(0, 100);
}

  //Mapping add code start

  // getting already selected items based on user id
  getTemplateListById(id:any){
    this._selectedCustId = id;
    this.__checkedList = "";
    this._masterService.getUserWiseTemplateList(id).subscribe((data:any) => { 
      this.largeDatasetForMap = data;
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

    for (let value of this.largeDatasetForMap) {

        if(this.selectedItems.indexOf(value.id) > -1){
          this.__checkedList +=value.id + "#";
          if(value.ischecked == 1){
            eachObj = {
              "id": value.id,
              "TemplateName": value.BranchName,
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
            "TemplateName": value.TemplateName,
            "ischecked": value.ischecked
          }
        }  
      finalArray.push(eachObj);  
    }

    let body = {
      "TemplateName": "",
      "SelectItem": "",
      "id": 0,
      "UserID": this._selectedCustId,
      "checkedList": this.__checkedList,
      "checklist": finalArray,
      "selectAll": false
    }

    this._masterService
      .createTemplateMapping(body)
      // .pipe(first())

      .subscribe((data) => {
        this.toaster.show('success', 'Branch Mapping Done', data);
        this.getTemplateListById(this._selectedCustId);
      });

     }
     master_change(){
      let _bool =this.AddTemplateMappingForm.controls['selectAll'].value;
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
