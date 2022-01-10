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

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  _FilteredList :any; 
  _DeptList:any;
  _IndexList:any;
  EntityList:any;
  _DeparmentList:any;
  BranchList:any;
  _Records :any; 
  _StatusList :any; 
  FileUPloadForm: FormGroup;
  submitted = false;
  Reset = false;     
  sMsg: string = '';    
  public progress: number;
  public message: string;
  _TemplateList:any; 
  myFiles:string [] = [];
  _FileDetails:string [][] = [];
  @Output() public onUploadFinished = new EventEmitter();
  constructor(
    private toaster: ToasterService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _UploadService: UploadService
  ) { }

  ngOnInit() {
    this.FileUPloadForm = this._formBuilder.group({         
      
      DeptID:[1],        
      DocID:[1],
      BranchID:['0', Validators.required],
      SubfolderID:[0, Validators.required],        
      TemplateID:[0, Validators.required],
      // TemplateID:[1],
      TemplateName: [''],
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      id:[0],
      CSVData:""
    });

   

    this.geBranchList();  
  //  this.getDeparmenList();
    this.geTTempList();
   // this.GetEntityList();
  //  this.geDoctypeList();
   
  }



  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    console.log($event.target.value);

    let val = $event.target.value;
    this._FilteredList = this._StatusList.filter(function (d) {
      for (var key in d) {
        if (key == "Department" || key == "BranchName" || key == "FileNo" ) {
          if (d[key].toLowerCase().indexOf(val) !== -1) {
            return true;
          }
        }
      }
      return false;
    });
  }
  onSelect({ selected }) {
    this.selected.splice(0, this.selected.length);
    this.selected.push(selected);
  }
  onActivate(event) {
    this.activeRow = event.row;
  }
    OnReset() {  
    this.Reset = true;
    this.FileUPloadForm.reset(); 
    this.FileUPloadForm.controls['BranchID'].setValue(0);
    this.FileUPloadForm.controls['TemplateID'].setValue(0);  
    this.FileUPloadForm.controls['SubfolderID'].setValue(0);    

    this.FileUPloadForm.controls['User_Token'].setValue(localStorage.getItem('User_Token')); 
    this.FileUPloadForm.controls['UserID'].setValue(localStorage.getItem('UserID'));    
    this.FileUPloadForm.controls['CreatedBy'].setValue(localStorage.getItem('UserID'));    

    }
    geBranchList() {
      const apiUrl =
      
      this._UploadService.GetBranchDetailsUserWise().subscribe((data: any) => {
        this.BranchList = data;
        this._FilteredList = data;
      });
    }

    // GetEntityList() {
    
    //   this._UploadService.GetSubFolderDetailsUserWise().subscribe((data: any) => {
    //     this.EntityList = data;
    //     this.FileUPloadForm.controls['SubfolderID'].setValue(0);
    //     //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    //   });
    // }
    geTemplateNameListByTempID(n:any) {
      this.getDoctypeListByTempID(n);
    }


    getDeptList() {  

    this._UploadService.GetDocList().subscribe((data: {}) => {     
    this._DeptList = data;
    this.FileUPloadForm.controls['DocID'].setValue(0);
    });
    }

    geTTempList() {
      
      this._UploadService.GetTemplateMappingListByUserID().subscribe((data: {}) => {
      this._TemplateList = data;
      this.FileUPloadForm.controls['TemplateID'].setValue(0);
      });
  
      }


    getDoctypeListByTempID(val:any) {
     
      this._UploadService.getDoctypeListByTempID(val).subscribe((data: {}) => {
        this._DeptList = data;
        this.FileUPloadForm.controls['DocID'].setValue(0);
      });
    }

    getFileDetails (e) {
      //console.log (e.target.files);
      this.myFiles = [];
      for (var i = 0; i < e.files.length; i++) {
        this.myFiles.push(e.files[i]);
      }
      this._IndexList = e.files;
    }

    public uploadFile = (files) => {
      if (files.length === 0) {
        return;
      }

      if (this.validation()  ==false)
      {
        return;
      }
      
     
      let filesToUpload : File[] = files;
      const formData = new FormData();        
        
      Array.from(filesToUpload).map((file, index) => {
        return formData.append('file'+index, file, file.name);
      });      

      formData.append('BranchID',this.FileUPloadForm.controls['BranchID'].value);
      formData.append('DeptID',"1");
      formData.append('DocID',"0");
      formData.append('TemplateID',this.FileUPloadForm.controls['TemplateID'].value);
      formData.append('UserID',localStorage.getItem('UserID'));
      formData.append('SubfolderID',this.FileUPloadForm.controls['SubfolderID'].value);    
      
      
      
      this._UploadService.UploadFiles(formData).subscribe((event: any) => {
        if (event.type === HttpEventType.UploadProgress)
          
            this.progress = Math.round(100 * event.loaded / event.total);
          else if (event.type === HttpEventType.Response) {
            this.message = 'Upload success.';
          this.onUploadFinished.emit(event.body);
          } else {
            this.message = 'in Else Event'+event.type;
          }
      });
     
    }

    uploadFiles(fileUpload) {
   
      if(this.FileUPloadForm.invalid) {
        this.toaster.show('warning', 'Please Select Branch Department Document Type before uploading!');
        console.log("false");
      } else {
        const frmData = new FormData();


        for (var i = 0; i < this.myFiles.length; i++) { 
          frmData.append("fileUpload", this.myFiles[i]);
        }
        frmData.append('BranchID',this.FileUPloadForm.controls['BranchID'].value);
        frmData.append('DeptID',"1");
        frmData.append('DocID',"0");
        frmData.append('TemplateID',this.FileUPloadForm.controls['TemplateID'].value);
        frmData.append('SubfolderID',this.FileUPloadForm.controls['SubfolderID'].value);       
       
        console.log("frmData",frmData);
        
        this._UploadService.UploadFiles(frmData).subscribe(
          data => {
            // SHOW A MESSAGE RECEIVED FROM THE WEB API.

            fileUpload.clear();
            this.myFiles = [];

            var strmsg =data;
            this.toaster.show('success', 'File Uploaded Succesfully.');
             
            var strmsg =data;
         this.downloadFile(data);
            this.OnReset();    
            this.myFiles = [];                   
          },
           
        );
      }

      
      }



      downloadFile(strmsg:any) {
        const filename = 'File upload status';
        
        let blob = new Blob(['\ufeff' + strmsg], {
          type: 'text/csv;charset=utf-8;'
        });
        let dwldLink = document.createElement("a");
        let url = URL.createObjectURL(blob);
        let isSafariBrowser = -1;
       
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
      //}
      }  

      showmessage(data:any)
      {
          //need to add validate text
       // this.toaster.show('success', 'File Uploaded Succesfully.',data);
        
      }
    
      validation()
      {
          if (this.FileUPloadForm.get('DeptID').value <=0 )
          {
                   this.showmessage("Please Select Department");
                    return false;
          }
          return true;
    
      }  
      
      
      // GetSubfolderByBranchID(BranchID:any) {
       
      //   this._UploadService.GetSubFolderByBranchID(BranchID).subscribe((data: any) => {
      //     this.EntityList = data;
      //     this.FileUPloadForm.controls['SubfolderID'].setValue(0);
      //   });
      // }

}
