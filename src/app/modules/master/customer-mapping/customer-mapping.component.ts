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

  createmodalopen:boolean = false; 
  _PageTitle:any = "New Customer Mapping";
  _toasterTitle:any = "Mapped!";
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
      id: [0],
      UserID: ["", Validators.required],
      BranchID: ["", Validators.required],
      checkedList: [""],
      RootID:[0],
      checklist: this._formBuilder.array([]),
      selectAll: [false],
      DeptID: [0],
    });
    this.getUserList();
    this.getCustomerWiseList(0);
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'BranchID',
      textField: 'BranchName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
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
    this.largeDataset = data;
    this.largeDataset = this.largeDataset.slice(0, 500);
    console.log(this.largeDataset);
    console.log(this._CustomerBranchList);
    
    this.displayTable = true;
    this.loader = false;
    });
  }
  get tf(){
    return this.AddBranchMappingForm.controls;
  }
  /*Create Customer Mapping */
  createCustomerMapping(){
    this._PageTitle = "New Customer Mapping";
    this._toasterTitle ="Mapped!";
    this.createmodalopen=true;
    this.getUserList();
    /*this.AddBranchMappingForm = this._formBuilder.group({
      TemplateName: ["", Validators.required],
      id:[0]
    });*/
   }
   /*Edit template*/
  editTemplate(template:any) {
    this._toasterTitle = "Updated!";
    this._PageTitle = "Edit template";
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
    this.getCustomerWiseList(0);
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
  // getting already selected items based on user id
  getCustListById(id:any){
    this._masterService.getCustomerWiseList(id).subscribe((data:any) => { 
      this.selectedItems = data;
    });
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
