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
  selector: 'app-custom-form',
  templateUrl: './custom-form.component.html',
  styleUrls: ['./custom-form.component.scss']
})
export class CustomFormComponent implements OnInit {

  @ViewChild('openmenu') toggleButton: ElementRef;
  @ViewChild('data-menu') menu: ElementRef;
  ViewCustomeForm: FormGroup;
 
  userFilter:any = { BranchName: '' };

  columns = [{prop: 'IndexField'}, {prop: 'DisplayName'}, {prop: 'FieldTypeText'}, {prop: 'MinLenght'}, {prop: 'MaxLenght'}];
  loader: boolean;
  TemplateList: any;
  _IndexList: any;
  _FilteredList:any;
  entries: any;
  selected: any;
  activeRow: any;
  Reset: boolean;
  largeDataset: any;
  createmodalopen:boolean = false;
  displayTable:boolean = true;
  
  constructor(
    private toaster: ToasterService,
    private _formBuilder: FormBuilder,
    private dialog: MatDialog,
    private _masterService: MasterService
  ) {}


  ngOnInit(): void {
    this.loader = false;
    this.ViewCustomeForm = this._formBuilder.group({
      TemplateName: ['', Validators.required],
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      id:[0],
      TemplateID:['0', Validators.required],
    }); 
    
    this.getTempList(0);
    this.getTemplate();
  }
  getTemplate() {  

   
    this._masterService.getAllData().subscribe((data) => {     
    this.TemplateList = data;    
    if(data.length>0){
      this.ViewCustomeForm.controls['TemplateID'].setValue(data[0].id);
    
    }
});
}

getTempList(TempID: number) {  

    this._masterService.getDataByTemplateId(TempID).subscribe((data: {}) => {     
      this._IndexList = data;
      this._FilteredList = data;
      console.log("this._FilteredList",this._FilteredList);
    });
}

geTemplateNameListByTempID(userid:number) {          

  this.getTempList(userid);      
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    console.log($event.target.value);

    let val = $event.target.value;
    this._FilteredList = this._IndexList.filter(function (d) {
      console.log(d);
      for (var key in d) {
        if (key == "TemplateName" || key == "DisplayName" || key == "FieldTypeText") {
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
    this.selected.push(...selected);
  }
  onActivate(event) {
    this.activeRow = event.row;
  }


  OnReset() {
    this.Reset = true;
    this.ViewCustomeForm.reset();
  }

  

  RedirectToEdit(_TempID: any)
  {  
    
  } 
  
     filternames(mList){
        this.largeDataset = mList;
     }
     searchforBranch(key){
        if(!key){

    }
  }    

}
