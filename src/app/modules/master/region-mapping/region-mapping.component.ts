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
  selector: 'app-region-mapping',
  templateUrl: './region-mapping.component.html',
  styleUrls: ['./region-mapping.component.scss']
})
export class RegionMappingComponent implements OnInit {

  @ViewChild('openmenu') toggleButton: ElementRef;
  @ViewChild('data-menu') menu: ElementRef;

  dataSource: any;
  loader:boolean;
  displayTable: boolean;
    selectedId: any;
  openlist: boolean = false;
  _TemplateList :any; 
  _DepartmentList:any;
  RegionMappingForm: FormGroup;
  AddRegionMappingForm: FormGroup;

  userFilter:any = { BranchName: '' };
  createmodalopen:boolean = false; 
  _PageTitle:any = "New Cabinet Access";
  _toasterTitle:any = "Access!";
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
  columns = [{prop: 'DepartmentName', displayName: 'Cabinet Name'}, {prop: 'BranchName', displayName: 'Folder Name'}];
  @ViewChild('search', { static: false }) search: any;
  //multi select drop down
  selectedItems: any = [];
  dropdownSettings:IDropdownSettings;
  largeDataset: any = [];
  maxOptions: any;
  _selectedCustId: any;
  __checkedList: string;
  submitted: boolean;
  custId: number;

  constructor(
    private toaster: ToasterService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _masterService: MasterService
  ) {}

  ngOnInit(): void {
    this.loader = false;
    this.RegionMappingForm = this._formBuilder.group({
      BranchName: [""],
      id: [0],
      DeptIDS: [""],
      
    });
    this.AddRegionMappingForm = this._formBuilder.group({
      BranchName: [""],
      SelectItem: [""],
      id: [0],
      DeptID: [""],
      checkedList: [""],          
      checklist: this._formBuilder.array([]),
      selectAll: [false],
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
    this.getRegionList();
    this.getBranchDetailsRegionWise(0);
    this.getRegionListById(0);
  }
  openMenu(id:any){
    this.selectedId = id;
    this.openlist = true;
  }
  /** Get Region List */
  getRegionList() {
    this._masterService.getDepartmentList().subscribe((data: {}) => {
      this._DepartmentList = data;
      this.AddRegionMappingForm.controls["DeptID"].setValue(0);
      this.RegionMappingForm.controls["DeptIDS"].setValue(0);
    });
  }
  getUserWiseTemplateList(userid: number){
    this._masterService.getUserWiseTemplateList(userid).subscribe((data: {}) => {
      this._DepartmentList = data;
      this.AddRegionMappingForm.controls["DeptID"].setValue(0);
      this.RegionMappingForm.controls["DeptIDS"].setValue(0);
    });
  }
  geBranchListByUserID(id: number) {
    this.custId = id;
    this.getBranchDetailsRegionWise(id);
  }
  /*Get all the customerWise template list */
  getBranchDetailsRegionWise(id:any) {
    this.loader = true;
    //this._TemplateList =[];
    this._masterService.getBranchDetailsRegionWiseAPI(id).subscribe((data: {}) => { 
    this.temp = data;    
    this._TemplateList = data;
    console.log(this._TemplateList);
    
    this.displayTable = true;
    this.loader = false;
    });
  }
  get tf(){
    return this.AddRegionMappingForm.controls;
  }
  /*Create region Mapping */
  createRegionMapping(){
    this._PageTitle = "New Cabinet Access";
    this._toasterTitle ="Access!";
    this.createmodalopen=true;
    this.getRegionList();
    //this.getBranchDetailsRegionWise(0);
    this.RegionMappingForm.controls["DeptIDS"].setValue(0);
   }
   /*Edit region mapping*/
  editRegionMapping() {
    this._toasterTitle = "Updated!";
    this._PageTitle = "Edit Cabinet Access";
    this.createmodalopen=true;
    this.getRegionList();
    //this.getBranchDetailsRegionWise(0);
    this.RegionMappingForm.controls["DeptIDS"].setValue(0);
  }
  /* Create and update the template*/
  templateUpdate(){
    console.log('Form data:' + JSON.stringify(this.RegionMappingForm.value));
    console.log(this.RegionMappingForm.value);

    this._masterService.addUpdateTemplateAPI(this.RegionMappingForm.value).subscribe(data => {
    this.toaster.show('success', this._toasterTitle, data);
    this.openlist = false;
    this.createmodalopen = false;
    this.getBranchDetailsRegionWise(0);
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
  const keys = ['DepartmentName', 'BranchName'];
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
  getRegionListById(id:any){
    this._selectedCustId = id;
    this.__checkedList = "";
    this._masterService.getRegionWiseData(id).subscribe((data:any) => { 
      this.largeDataset = data;
    });
  }
  selectedItem(e, item){
    this.largeDataset.forEach((ele,index) => {
      if(ele.id === item.id) {
        if(e.target.checked) {
          item.ischecked = true;
          this.selectedItems.push(item.id);
        } else {
          item.ischecked = false;
          this.selectedItems = this.selectedItems.filter(el=> el !== item.id);
        }
      }
    });
    const isAllChecked = this.largeDataset.filter(el => el.ischecked).length === this.largeDataset.length;
    this.AddRegionMappingForm.controls['selectAll'].patchValue(isAllChecked);
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
              "BranchName": value.BranchName,
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
      "DeptID": this._selectedCustId,
      "checkedList": this.__checkedList,
      "checklist": finalArray,
      "selectAll": false
    }

    this._masterService.createRegionMapping(body).subscribe((data) => {
        this.toaster.show('success', 'Cabinet Access Done', data);
        this.getRegionListById(this._selectedCustId);
        this.createmodalopen=false;
      });

     }
     master_change(){
      let _bool =this.AddRegionMappingForm.controls['selectAll'].value;
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
 deleteTemplateData(templateId:any){
  let data = {
    "BranchName":"",
    "id":templateId,
    "DeptIDS":this.custId
  };
  this._masterService.deleteRegionAPI(data).subscribe(data => {
    this.toaster.show('warning', 'Deleted!', data);
    this.getBranchDetailsRegionWise(0);
  });   
  }

}
