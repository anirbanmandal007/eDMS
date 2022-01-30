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
  temp: any;
  columns = [{prop: 'IndexField', displayName: 'Field'}, {prop: 'FieldTypeText', displayName: 'Data Type'}, {prop: 'MaxLenght', displayName: 'Lenght'}];

//  columns = [{prop: 'IndexField'}, {prop: 'DisplayName'}, {prop: 'FieldTypeText'}, {prop: 'MaxLenght'}];
@ViewChild('search', { static: false }) search: any;
  loader: boolean;
  TemplateList: any;
  _IndexList: any;
  _FilteredList:any;
  entries: any;
  selected: any;
  activeRow: any;
  largeDataset: any;
  createmodalopen:boolean = false;
  displayTable:boolean = true;
  AddCustomForm: FormGroup; 
  submitted = false;
  Reset: boolean = false;     
  sMsg: string = '';
  BranchForm: FormGroup;
  _TempID: any =0;
  _IndexID: any =0;
  _IndexFieldData:any; 
  templateId: any;
  _PageTitle: string;
  
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
    this.AddCustomForm = this._formBuilder.group({
      TemplateID: [0, Validators.required],
      IndexField: ['', Validators.compose([Validators.required])],
      DisplayName: ['', Validators.required],      
      MinLenght: [1],        
      //CloginPass: ['', Validators.required],
      MaxLenght: ['', Validators.required],
      FieldType: [0, Validators.required],    
      ListData: [''],
      IsMandatory: [''],
      IsAuto: [''], 
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      id:[0]
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
      this.temp=data;
      console.log("this._FilteredList",this._FilteredList);
    });
}

geTemplateNameListByTempID(templateId:number) {          

    this.templateId = templateId
  this.getTempList(templateId);      
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
    this.AddCustomForm.reset();
    this.createmodalopen = false;
  }
  
    filternames(mList){
        this.largeDataset = mList;
    }
    searchforBranch(key){
        if(!key){
        }
    }
    
    onSubmit() {
      this.submitted = true;
     // console.log(this.AddCustomForm);
      if (this.AddCustomForm.invalid) {
        alert("Please Fill the Fields");
        return;
      }
      let _IsAuto =0;
      
      // if (this.AddCustomForm.get("IsAuto").value)
      // {
      //   _IsAuto =1;
      // }
  
      let _IsMandatory =0;    
      if (this.AddCustomForm.get("IsMandatory").value)
      {
        _IsMandatory =1;
      }
  
      this.AddCustomForm.patchValue({
        id: this._IndexID ,
        User_Token: localStorage.getItem('User_Token') ,           
        CreatedBy:localStorage.getItem('UserID') ,
        });
  
        this.AddCustomForm.patchValue({
          id: this._IndexID ,
          User_Token: localStorage.getItem('User_Token') ,           
          CreatedBy:localStorage.getItem('UserID') ,
          IsMandatory:_IsMandatory,
          IsAuto:_IsAuto
          });

      
      this._masterService.createFields(this.AddCustomForm.value).subscribe((data: {}) => {     
    
       
       this.OnReset();
       this.createmodalopen = false;
       this.getTempList(0);
       this.getTemplate();
      });
  
    }
    getindexListData(val:any) { 
      
      this.templateId = val;
      this._masterService.getAllfields(val).subscribe((data: {}) => {     
      var that = this;
      that._IndexFieldData =data;

      this.AddCustomForm.controls['TemplateID'].setValue(that._IndexFieldData.TemplateID);
      this.AddCustomForm.controls['IndexField'].setValue(that._IndexFieldData.IndexField);
      this.AddCustomForm.controls['DisplayName'].setValue(that._IndexFieldData.DisplayName);
      this.AddCustomForm.controls['FieldType'].setValue(that._IndexFieldData.FieldType);
      this.AddCustomForm.controls['MaxLenght'].setValue(that._IndexFieldData.MaxLenght);
      this.AddCustomForm.controls['ListData'].setValue(that._IndexFieldData.ListData);
      this.AddCustomForm.controls['IsMandatory'].setValue(that._IndexFieldData.IsMandatory);
  
      that._IndexFieldData="";
      localStorage.setItem('_TempID','0') ;
      this.createmodalopen = true;
      });
    }     
    addFields(){
      this._PageTitle = "Add Fields";
      this.createmodalopen = true;
    }
    RedirectToEdit(val:any){
      this._PageTitle = "Edit Fields";
      this.getindexListData(val);
    }

    deleteField(fieldId:any,fieldName:any){
      const message = `Are you sure you want delete this Field: `+fieldName+`?`;
      const dialogData = new ConfirmDialogModel("Confirm Deletion", message, 'Delete', 'Cancel');
  
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        maxWidth: "0",
        data: dialogData
      });
  
      dialogRef.afterClosed().subscribe(dialogResult => {
        if(dialogResult) {
        this.deleteTemplateData(fieldId);
        } else {
        }
      });
    }
    deleteTemplateData(fieldId:any){
    let data = {
      "TemplateName":"",
      "id":fieldId,
      "TemplateID":this.templateId
  }

  console.log("data",data);
    this._masterService.deleteField(data).subscribe(data => {
      this.toaster.show('warning', 'Deleted!', data);
      this.getTempList(0);
      this.getTemplate();
    });   
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
      const keys = ['IndexField', 'FieldTypeText','MaxLenght'];
      // assign filtered matches to the active datatable
      this._FilteredList = this.temp.filter(item => {
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
}
