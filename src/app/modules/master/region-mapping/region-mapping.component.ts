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
  columns = [{prop: 'DepartmentName'}, {prop: 'BranchName'}];
  @ViewChild('search', { static: false }) search: any;
  //multi select drop down
  selectedItems: any = [];
  dropdownSettings:IDropdownSettings;
  largeDataset: any = [];
  maxOptions: any;

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
  /*Create Customer Mapping */
  createCustomerMapping(){
    this._PageTitle = "New Template Mapping";
    this._toasterTitle ="Mapped!";
    this.createmodalopen=true;
    this.getRegionList();
    //this.getBranchDetailsRegionWise(0);
    this.RegionMappingForm.controls["DeptIDS"].setValue(0);
   }
   /*Edit template*/
  editTemplate(template:any) {
    this._toasterTitle = "Updated!";
    this._PageTitle = "Edit template";
    this.RegionMappingForm = this._formBuilder.group({
   // TemplateName: [template.TemplateName, Validators.required],
    //id:template.id
    });
    this.createmodalopen=true;
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
  deleteTemplateData(templateId:any){
  let data = {
    "id":templateId
  };
  this._masterService.deleteTemplateAPI(data).subscribe(data => {
    this.toaster.show('warning', 'Deleted!', data);
    this.getBranchDetailsRegionWise(0);
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

}
