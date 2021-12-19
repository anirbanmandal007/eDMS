import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { reportsService } from '../reports.service';
import { ToasterService } from 'app/shared/toaster/toaster.service';
@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent implements OnInit {
  selected: any[] = [];
  temp = [];
  activeRow: any;
 
  LogReportForm: FormGroup;
  _SingleDepartment: any;
  submitted = false;
  Reset = false;     
  sMsg: string = '';     
  _FilteredList :any; 
  _StatusList:any;
  _HeaderList:any;
 
  _ColNameList = ["UserName","FileNo", "Activity", "LogDate"];


  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  uid: any;
  displayTable:boolean = false;
  dtOptions: { processing: boolean; ordering: boolean; info: boolean; searching: boolean; paging: boolean; pageLength: number; };

  constructor(
    private __formBuilder: FormBuilder,
    private __reportservice:reportsService,
    private toaster: ToasterService
  ) { }

  ngOnInit(): void {
    let userData = localStorage.getItem('userData');
    this.uid = JSON.parse(userData).id;
    this.LogReportForm = this.__formBuilder.group({
      DATEFROM: ['', Validators.required],
      DATETO: ['', Validators.required],  
      ActiivtyID:[''],  
      User_Token:  localStorage.getItem('User_Token') ,  
      CreatedBy: this.uid ,      
    });
    this.LogReportForm.controls['ActiivtyID'].setValue(0);   
  }
  onSearch()
  {
    this.getLogList();
  }
  onDownload()
  {
    this.downloadFile();
  }

  GetHeaderNames()
  {
    this._HeaderList="";
    for (let j = 0; j < this._ColNameList.length; j++) { 
        this._HeaderList += this._ColNameList[j] +((j <= this._ColNameList.length-2)?',':'') ;
    }
    this._HeaderList += '\n'
    this._StatusList.forEach(stat => {
      for (let j = 0; j < this._ColNameList.length; j++) {  
        this._HeaderList += (stat[this._ColNameList[j]]) + ((j <= this._ColNameList.length-2)?',':'') ;
      }
      this._HeaderList += '\n'
    });
      
  }
  
  downloadFile() { 
    this.GetHeaderNames()
    let csvData = this._HeaderList; 
    if(this._StatusList.length>0) {
    let blob = new Blob(['\ufeff' +  csvData], { 
        type: 'text/csv;charset=utf-8;'
    }); 
    let dwldLink = document.createElement("a"); 
    let url = URL.createObjectURL(blob); 
    let isSafariBrowser =-1;
    if (isSafariBrowser) {  
        dwldLink.setAttribute("target", "_blank"); 
    } 
    dwldLink.setAttribute("href", url); 
    dwldLink.setAttribute("download",  "LogReport" + ".csv"); 
    dwldLink.style.visibility = "hidden"; 
    document.body.appendChild(dwldLink); 
    dwldLink.click(); 
    document.body.removeChild(dwldLink); 
  } else {
    this.toaster.show('error', 'Error!', 'There should be some data before you download!');
  }
  }
 
  isValid() {
    return this.LogReportForm.valid 
  }

  getLogList() {  
           
    this.__reportservice.showLog(this.LogReportForm.value)
    .subscribe( data => {
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
      this.displayTable = true;

  });


  } 

}
