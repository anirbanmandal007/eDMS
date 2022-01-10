import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { ToasterService } from 'app/shared/toaster/toaster.service';
import { UploadService } from '../upload.service';
import { ConfirmationDialogComponent, ConfirmDialogModel } from 'app/shared/confirmation-dialog/confirmation-dialog.component';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { SelectionType } from '@swimlane/ngx-datatable';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from 'app/core/auth/auth.service';


@Component({
  selector: 'app-csv-upload',
  templateUrl: './csv-upload.component.html',
  styleUrls: ['./csv-upload.component.scss']
})
export class CsvUploadComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  _SingleDepartment: any;
  submitted = false;
  Reset = false;     
  sMsg: string = '';      
  _FilteredList = []; 
  TemplateList:any;
  _IndexList:any;
  _Records :any; 
  DataUploadForm: FormGroup;
  
  public message: string;
  _HeaderList: any;
  _ColNameList = [];
  _CSVData: any;
  public records: any[] = [];
  papa: any;
  _TempID: any = 0;
  loader:boolean = false;
  myFiles:string [] = [];
  _FileDetails:string [][] = [];
  
  @Output() public onUploadFinished = new EventEmitter();
  userToken: any;
  createdBy: any;
  constructor( 
    private toaster: ToasterService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _UploadService: UploadService,
    private _authService: AuthService
    ) {
      this.userToken = this._authService.accessToken;
    this.createdBy = JSON.parse(localStorage.getItem('userData')).id;
     }

  ngOnInit() {
    this.DataUploadForm = this._formBuilder.group({
      TemplateName: ['', Validators.required],
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      id:[0],
      TemplateID: [0, Validators.required],
       CSVData:[""]
    });      

    this.geTTempList();
  }
   

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
 //   console.log($event.target.value);

    let val = $event.target.value;
    let that = this
    this._FilteredList = this.records.filter(function (d) {
    //  console.log(d);
      for (var key in d) {
        if (d[key].toLowerCase().indexOf(val) !== -1) {
          return true;
        }
      }
      return false;
    });
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }
  onActivate(event) {
    this.activeRow = event.row;
  }

  OnReset() {
    this.Reset = true;
    this.DataUploadForm.reset();
    this.DataUploadForm.controls['User_Token'].setValue(localStorage.getItem('User_Token')); 
    this.DataUploadForm.controls['UserID'].setValue(localStorage.getItem('UserID'));    
    this.DataUploadForm.controls['CreatedBy'].setValue(localStorage.getItem('UserID'));    
   // this.getTemplate();
   this.DataUploadForm.controls['TemplateID'].setValue(0);
  }

  geTTempList() {
    this._UploadService.getTemplateMappingListByUserID().subscribe((data: {}) => {
    this.TemplateList = data;
    this.DataUploadForm.controls['TemplateID'].setValue(0);
     console.log("this._TemplateLis", data);
    });

    }

  GetDisplayField(TID: number) {

    this._UploadService.getFieldsName(TID).subscribe((data) => {

      this._ColNameList = data;
      this.GetHeaderNames();

    });
  }

  handleFileSelect(evt) {
    var files = evt.target.files; // FileList object
    
    if(this.DataUploadForm.valid && files.length>0) {
      var file = files[0];
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (event: any) => {
        var csv = event.target.result; // Content of CSV file
        this.papa.parse(csv, {
          skipEmptyLines: true,
          header: true,
          complete: (results) => {
            for (let i = 0; i < results.data.length; i++) {
              let orderDetails = {
                order_id: results.data[i].Address,
                age: results.data[i].Age
              };
              this._Records.push(orderDetails);
            }
            // console.log(this.test);
            // console.log('Parsed: k', results.data);
          }
        });
      }
    } else {
      this.toaster.show('error', "Please select CSV file/ Template before uploading");
    }
  }

  uploadListener($event: any): void {

    let text = [];
    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0]) && this.DataUploadForm.get('TemplateID').value > 0) {
      
      let input = $event.target;
      let reader = new FileReader();
     // console.log(input.files[0]);
      reader.readAsText(input.files[0]);
      $(".selected-file-name").html(input.files[0].name);
      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this._CSVData = csvRecordsArray;
        this._IndexList = csvRecordsArray;

        // alert(headersRow);
        // alert(this._ColNameList);
        //let ColName = 
        let validFile = this.getDisplayNames(csvRecordsArray);
        if (validFile == false) {
        //  console.log('Not Valid File', csvRecordsArray);
          this.fileReset();
        } else {
          this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
  
          this._FilteredList = this.records;
          (<HTMLInputElement>document.getElementById('csvReader')).value = '';
        //  console.log('Records', this._FilteredList);
        }
      };

      reader.onerror = function () {
       // console.log('error is occurred while reading file!');
      };

    } else {
      this.toaster.show('error', "Please select a valid CSV and a Template.");
      this.fileReset();
    }
    this._FilteredList = this.records
    
  }

  checkDateFormat(date) {
  //  console.log("Date",date);

    if (date !="")
    {
    let dateArr = date.split('-');
    const dateString = dateArr[1] + '/' + dateArr[0] + '/' + dateArr[2];
    if(isNaN(dateArr[0]) || isNaN(dateArr[1]) || isNaN(dateArr[2])) {
      return false;
    }
    if(isNaN(new Date(dateString).getTime())) {
      return false;
    }
    return true;
  }
  else
  {
    return true;
  }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
        const single = []
        for (let i = 0; i < this._ColNameList.length; i++) {
          single.push(curruntRecord[i].toString().trim())
        }
        csvArr.push(single)
      }
    }
    return csvArr;
  }

  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  fileReset() {
    //this.csvReader.nativeElement.value = "";  
    this.records = [];
  }

  onSubmit() {

        this.submitted = true;
        if (this.validation() == false ) {
        //alert("Please Fill the Fields");
        // this.ShowErrormessage("Please Fill the Fields");

        return;  
    } 


    this.DataUploadForm.patchValue({
      id: this.createdBy,
      CSVData: this._CSVData,     
      User_Token: this.userToken,    
      CreatedBy: this.createdBy
    });
    

   
    this._UploadService.uploadCsv(this.DataUploadForm.value)
      // .pipe(first())
      .subscribe(data => {
         
        this.toaster.show('success', data);


      });

    //  }     

  }

  ShowErrormessage(data:any)
  {
    this.toaster.show('warning', data);


  }

  geTemplateNameListByTempID(TID: number) {
    this.GetDisplayField(TID);

  // console.log(this.DataUploadForm.get('TemplateID').);

  }

  onFormat(csvRecordsArr: any) {
    //   let dt;



  }

  getDisplayNames(csvRecordsArr: any) {
    let headers = (<string>csvRecordsArr[0]).split(',');
    let headerArray = [];
console.log(this._ColNameList);
console.log(headers);

    if (headers.length != this._ColNameList.length) {
     // alert('Invalid No. of Column Expected :- ' + this._ColNameList.length);
     var msg= 'Invalid No. of Column Expected :- ' + this._ColNameList.length; 
     //this.showmessage(msg);
     this.ShowErrormessage(msg);

      return false;
    }

    for (let j = 0; j < headers.length; j++) {
      if (headers[j].toLowerCase() != this._ColNameList[j].DisplayName.toLowerCase()) {
        //alert('In Valid Column Name :-- ' + headers[j] + ' --Expected: ' + this._ColNameList[j].DisplayName);
        var msg= 'In Valid Column Name :-- ' + headers[j] + ' --Expected: ' + this._ColNameList[j].DisplayName; 
     this.showmessage(msg);
        
        return false;
      }
      // headerArray.push(headers[j]);  
    }
    return true;
  }


  GetHeaderNames() {
    this._HeaderList = "";
    for (let j = 0; j < this._ColNameList.length; j++) {

      this._HeaderList += this._ColNameList[j].DisplayName + ',';
    }

  }

  downloadFile() {
    const filename = 'CSVFileUpload';
    if (this.validation() == true)    {
    let csvData = this._HeaderList;    
    //console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv;charset=utf-8;'
    });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = -1;
    // let isSafariBrowser = navigator.userAgent.indexOf( 'Safari') != -1 & amp; & amp; 
    // navigator.userAgent.indexOf('Chrome') == -1; 

    //if Safari open in new window to save file with random filename. 
    if (isSafariBrowser) {
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }
  }  

  showmessage(data:any)
  {
    this.toaster.show('warning', data);


  }

  validation()
  {
    
      if (this.DataUploadForm.get('TemplateID').value <=0 )
      {
               this.ShowErrormessage("Please Select Template ID");
                return false;
      }
            return true;

  }
 
  getCellClass = ({ row, column, value }): any => {
    // return {
    //   'date-field': this._ColNameList.filter((el, index) => el.DisplayName === column.name)[0].FieldType === '3'
    // }

    const field = this._ColNameList.filter((el, index) => el.DisplayName === column.name)[0];
    const fieldIndex = this._ColNameList.findIndex(el => el.DisplayName === column.name);
    let cssClass = '';
    switch(field.FieldType) {
      case ('1') : // Text field
        if(field.IsMandatory && row[fieldIndex] === '') { // Required field check
          cssClass += ' error text-required';
        }
        if(!(/^[a-z][a-z\s]*$/.test(row[fieldIndex]))) { // Letter validation check
          cssClass += ' error letter-only';
        }
        break;

      case ('2') :
        if(isNaN(row[fieldIndex])) {
          cssClass = ' error numeric-only';
        }
        break;

      case ('3') :
        if(!this.checkDateFormat(row[fieldIndex])) {
          cssClass = ' error date-only';
        }
        break;
      case ('5') :
        if(!(/^[\w\-\s]+$/.test(row[fieldIndex]))) { // Alpha-Numeric validation check
          cssClass = ' error alpha-numeric-only';
        }
        break;
    }
    return cssClass;
  }
  isValidationError = false;
  getTooltipDate(tooltipRef, rowIndex, colIndex) {
    if(!tooltipRef) {
      return;
    }
    
    let tooltipData = '';
    if(tooltipRef.parentElement.parentElement.classList.contains('text-required')) {
      tooltipData = 'This field is required';
    } else if(tooltipRef.parentElement.parentElement.classList.contains('letter-only')) {
      tooltipData = 'Only letters are allowed';
    } else if(tooltipRef.parentElement.parentElement.classList.contains('numeric-only')) {
      tooltipData = 'Only numeric fields are allowed';
    } else if(tooltipRef.parentElement.parentElement.classList.contains('date-only')) {
      tooltipData = 'Date required in dd-mm-yyyy format';
    } else if(tooltipRef.parentElement.parentElement.classList.contains('alpha-numeric-only')) {
      tooltipData = 'Only letters and digits are allowed';
    }
    if(tooltipData !== '') {
      this.isValidationError = true;
    }
    return tooltipData;
  }

  hasDataError() {
    if(document.querySelectorAll('.datatable-body-cell.error').length > 0) {
      return true;
    }
    return false;
  }

}
