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
  selector: 'app-sftp-upload',
  templateUrl: './sftp-upload.component.html',
  styleUrls: ['./sftp-upload.component.scss']
})
export class SftpUploadComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  _SingleDepartment: any;
  submitted = false;
  Reset = false;     
  BranchList:any;
  sMsg: string = '';      
  _FilteredList = []; 
  TemplateList:any;
  _FileList:any;
  _Records :any; 
  sftpuploadForm: FormGroup;
  
  public message: string;
  _HeaderList: any;
  _ColNameList = [];
  _CSVData: any;
  public records: any[] = [];
  _DepartmentList:any;
  _TempID: any = 0;
  
  myFiles:string [] = [];
  _FileDetails:string [][] = [];
  
  @Output() public onUploadFinished = new EventEmitter();
  userToken: string;
  createdBy: any;
  _global: any;
  toastr: any;
  loader:boolean = false;
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
      this.sftpuploadForm = this._formBuilder.group({
        BranchID: ['',],
        DeptID: [""],
        User_Token: localStorage.getItem('User_Token') ,
        CreatedBy: localStorage.getItem('UserID') ,
  
      });     
  
  this.GetCountOnly();
  this.getDepartmnet();
  this.geBranchList(0);
    }   
    getDepartmnet() {
  
      
      this._UploadService.getDeptList().subscribe((data: {}) => {
      this._DepartmentList = data;
  
      this.sftpuploadForm.controls['DeptID'].setValue(0);
      this.sftpuploadForm.controls['BranchID'].setValue(0);
      });
  
      }
  
    entriesChange($event) {
      this.entries = $event.target.value;
    }
    filterTable($event) {
      console.log($event.target.value);
  
      let val = $event.target.value;
      let that = this
      this._FilteredList = this.records.filter(function (d) {
        console.log(d);
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
      this.sftpuploadForm.reset();
      this.sftpuploadForm.controls['User_Token'].setValue(localStorage.getItem('User_Token')); 
      this.sftpuploadForm.controls['UserID'].setValue(localStorage.getItem('UserID'));    
      this.sftpuploadForm.controls['CreatedBy'].setValue(localStorage.getItem('UserID'));   
    }

    GetCountOnly() {
     
      this._UploadService.getAllCount().subscribe((data: any) => {
        this._FileList = data;
        this._FilteredList = data;    
       
      });
    }
  
    GetFileCount() {
  
      var bid =this.sftpuploadForm.get("BranchID").value;
      if (bid ==null)
      {
  
        bid=0;
      }

        
        this._UploadService.getFileCount(this.sftpuploadForm.get("DeptID").value,bid).subscribe((data: any) => {
        this._FileList = data;
        this._FilteredList = data;   
       
      });
    }
  
    geBranchListByUserID(userid: number) {
      this.geBranchList(userid);
    }
   
    geBranchList(userid: any) {
      
      this._UploadService.getCustomerList(userid).subscribe((data: any) => {
        this.BranchList = data;
      });
    }
  
  
    onSubmit() {
  
     
      this._UploadService.sftpupload(this.sftpuploadForm.value)
        // .pipe(first())
        .subscribe(data => {
           
          this.toaster.show('warning', "File Uploaded Successfully");
  
          var strmsg =data;
          this.downloadFile(data);
  
        });
  
      //  }     
  
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
      this.toaster.show('warning', data);
  
  
    }
  
    validation()
    {
      
        if (this.sftpuploadForm.get('TemplateID').value <=0 )
        {
                 this.showmessage("Please Select Template ID");
                  return false;
        }
  
  
        return true;
  
    }
}
