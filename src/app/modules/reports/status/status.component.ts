import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { reportsService } from '../reports.service';
import { ToasterService } from 'app/shared/toaster/toaster.service';
import { ConfirmationDialogComponent, ConfirmDialogModel } from 'app/shared/confirmation-dialog/confirmation-dialog.component';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {
  selected: any[] = [];
  temp = [];
  activeRow: any;
  StatusReportForm: FormGroup;
  _SingleDepartment: any;
  submitted = false;
  Reset = false;     
  sMsg: string = '';     
  _FilteredList :any; 
  _StatusList:any;
  _HeaderList:any;
  TemplateList:any;
  dtOptions: any;
  displayTable:boolean = false;
  loader:boolean = false;
  _ColNameList = ["Customer", "Department", "FileNo", "PageCount", "IsIndexing"];

  tagItems = ["Bucharest", "Cluj", "Iasi", "Timisoara", "Piatra Neamt"];

  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  uid: any;
  //ng table data populate
  temp_data: any;
  columns = [{prop: 'Department', displayName: 'Cabinet'}, {prop: 'FileNo', displayName: 'File Name'}, {prop: 'PageCount', displayName: 'PageCount'}];

  //columns = [{prop: 'Department'}, {prop: 'Customer'},{prop: 'FileNo'}, {prop: 'PageCount'},{prop: 'IsIndexing'}];
  
  @ViewChild('search', { static: false }) search: any;
  constructor(
    private __formBuilder: FormBuilder,
    private __reportservice:reportsService,
    private toaster: ToasterService
   ) {
    
   }
  
  ngOnInit(): void {
    this.loader = false;
    let userData = localStorage.getItem('userData');
    this.uid = JSON.parse(userData).id;

    this.StatusReportForm = this.__formBuilder.group({
      TemplateID: [, Validators.required],  
      _Flag: [, Validators.required],        
      User_Token:  localStorage.getItem('User_Token') ,  
      CreatedBy: this.uid ,      
    });

    this.getTemplate();
    
  }
  getTemplate() {  
    this.__reportservice.getTemplateData(this.uid).subscribe((data: {}) => {     
    this.TemplateList = data; 
    this.StatusReportForm.controls['TemplateID'].setValue(0);
    this.StatusReportForm.controls['_Flag'].setValue(0);
    });
}
getStatusList() {  
  this.loader =true;     
  this.__reportservice.showStatus(this.StatusReportForm.value).subscribe( data => {
    this.temp_data = data;
    this._StatusList = data;          
    this._FilteredList = data;     
    this.dtOptions = {
      processing: true,
      ordering: true,
      info: false,
      searching: true,
      paging: true,
      pageLength:10
    }
    this.loader = false;
    this.displayTable = true;
    console.log(data);

});

} 
onDownload(){this.downloadFile();}
onSearch(){ this.getStatusList();}
downloadFile() { 
  this.GetHeaderNames()
  let csvData = this._HeaderList;     
  console.log(csvData) 
  if(this._StatusList.length>0) {
  let blob = new Blob(['\ufeff' +  csvData], { 
      type: 'text/csv;charset=utf-8;'
  }); 
  let dwldLink = document.createElement("a"); 
  let url = URL.createObjectURL(blob); 
  let isSafariBrowser =-1;
  //if Safari open in new window to save file with random filename. 
  if (isSafariBrowser) {  
      dwldLink.setAttribute("target", "_blank"); 
  } 
  dwldLink.setAttribute("href", url); 
  dwldLink.setAttribute("download",  "StatusReport" + ".csv"); 
  dwldLink.style.visibility = "hidden"; 
  document.body.appendChild(dwldLink); 
  dwldLink.click(); 
  document.body.removeChild(dwldLink); 
} else {
  this.toaster.show('error', 'Error!', 'There should be some data before you download!');
}
}
GetHeaderNames()
{
  this._HeaderList="";
  for (let j = 0; j < this._ColNameList.length; j++) {  
       
      this._HeaderList += this._ColNameList[j] +((j <= this._ColNameList.length-2)?',':'') ;
    // headerArray.push(headers[j]);  
  }
  this._HeaderList += '\n'
  this._StatusList.forEach(stat => {
    for (let j = 0; j < this._ColNameList.length; j++) {  
      this._HeaderList += (stat[this._ColNameList[j]]) + ((j <= this._ColNameList.length-2)?',':'') ;
      // headerArray.push(headers[j]);  
    }
    this._HeaderList += '\n'
  });
  

}
isValid() {
  return this.StatusReportForm.valid 
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
const keys = ['Department', 'Customer','FileNo', 'PageCount','IsIndexing'];
// assign filtered matches to the active datatable
this._FilteredList = this.temp_data.filter(item => {
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
/* ngx table end */

}
