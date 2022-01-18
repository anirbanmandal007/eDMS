import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { ToasterService } from 'app/shared/toaster/toaster.service';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-delete-files',
  templateUrl: './delete-files.component.html',
  styleUrls: ['./delete-files.component.scss']
})
export class DeleteFilesComponent implements OnInit {
  shwfrm: boolean = false;
  DeleteFilesForm: FormGroup;
  _CSVData: any;
  _global: any;
  _TemplateList: {};
  records: any[];
  constructor(
    private toaster: ToasterService,
    private _formBuilder: FormBuilder,
    private searchService: SearchService 
  ) { }

  ngOnInit(): void {
    this.DeleteFilesForm = this._formBuilder.group({
      FileNo: [''],   
      DeleteID: [0, Validators.required],  
      TemplateID: [0, Validators.required],  
    });
    this.DeleteFilesForm.controls['TemplateID'].setValue(0);
    this.DeleteFilesForm.controls['DeleteID'].setValue(0);
    
   this.getTemplate();
  }
  uploadListener($event){
    let files = $event.srcElement.files;
    
        if (this.isValidCSVFile(files[0]) && this.DeleteFilesForm.get('TemplateID').value > 0) {
          
          let input = $event.target;
          let reader = new FileReader();
          console.log(input.files[0]);
          reader.readAsText(input.files[0]);
    
          reader.onload = () => {
            let csvData = reader.result;
            let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
            console.log("csvRecordsArray", csvRecordsArray);   
            
              this._CSVData= "";
              for (let j = 0; j < csvRecordsArray.length; j++) {          
                this._CSVData += csvRecordsArray[j] + ',';
                // headerArray.push(headers[j]);  
                console.log("CSV Data", this._CSVData);
              }
          };
    
          reader.onerror = function () {
            console.log('error is occurred while reading file!');
          };
    
        } else {
          this.toaster.show("error","Please Select A Valid CSV File And Template");
          
          this.fileReset();
        }
  }
  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }
  geTemplateNameListByTempID(){}

  downloadFile() {
    this.shwfrm = true;
    const filename = 'DeelteFileFormat';
    
    let csvData = "FileNo,";   
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

  DeleteFiles() {

    this.DeleteFilesForm.patchValue({
      FileNo: this._CSVData,      
     
    });

    this.searchService.DeleteBulkFiles(this.DeleteFilesForm.value)
    .subscribe( data => {
      
      console.log("Data",data);
    //  this.showmessage(data);
      
    alert(data);

    });
  }
  getTemplate() {
    this.searchService.GetTemplateMappingListByUserID().subscribe((data: {}) => {
      this._TemplateList = data;
      this.DeleteFilesForm.controls['TemplateID'].setValue(0);
    });
  }  
  fileReset() {
    this.records = [];
  }
}
