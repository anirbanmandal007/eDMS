import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { ToasterService } from 'app/shared/toaster/toaster.service';
import { ProcessService } from '../process.service';

@Component({
  selector: 'app-view-indexing',
  templateUrl: './view-indexing.component.html',
  styleUrls: ['./view-indexing.component.scss']
})
export class ViewIndexingComponent implements OnInit {
  doc: any;
  _TemplateList: any;
  selectedTemplate: any;
  branchList:any;
  indexForm: FormGroup;
  fileNo: any;
  dynamicFIelds: any = [];
  docLoaded = false;
  rowData: any;

  constructor(
    private _processService: ProcessService,
    private _activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private _authService: AuthService,
    private toaster: ToasterService
  ) { }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe(params => {
      this.fileNo = params['id'];
      this._processService.getIndexingFile(this.fileNo).subscribe(res => {
        this.doc = res;
        this.docLoaded = true;
      })
    });
    this.rowData = window.history?.state?.rowData || JSON.parse(localStorage.getItem('rowData'));
    localStorage.setItem('rowData', JSON.stringify(this.rowData))
    this.getTemplates();
    this.getBranchList();
    this.initiateIndexForm();
  }

  initiateIndexForm() {
    this.indexForm = this.fb.group({
      TemplateID: [0, Validators.required],
      BranchID: [0, Validators.required],
      DeptID: [1],
      Viewer:1,
      currentPage:0,
      User_Token: this._authService.accessToken,
      CreatedBy: localStorage.getItem('UserID') || 1 ,
      PageCount:0,
      submit_data:[''],     
      di:[''], 
      FVals:[''], 
      TemplateName:[''],    
      BranchName:[''],
    });
  }

  getTemplates() {
    this._processService.getTemplates().subscribe((data: any) => {
      this._TemplateList = data;
      this.selectedTemplate = data[0]?.TemplateName;
      const selectedTemp = data.find(el => el.TemplateName === this.rowData.TemplateName)?.TemplateID || 1;
      this.indexForm.controls['TemplateID'].setValue(selectedTemp);
      if(selectedTemp) {
        this.getFields();
      }
    });
  }

  getFields() {
    const tempId = this.indexForm.controls['TemplateID'].value;
    this._processService.getFields(tempId, this.fileNo).subscribe(res => {
      this.dynamicFIelds = res;
      let dynamic_form = {}
      this.dynamicFIelds.forEach((ele, index) =>{
        if(!dynamic_form[ele.IndexField]) {
          let validation_array = [Validators.minLength(dynamic_form[ele.MinLength]), Validators.maxLength(ele.MaxLength)];
          if(ele.IsMandatory == '0') validation_array.push(Validators.required);
          var select_val = [];
          if(ele.FieldType == '4') {
          select_val = ele.MasterValues.split(',');
          dynamic_form[ele.IndexField] = new FormControl(ele.ColValues,validation_array);
          } else {
          dynamic_form[ele.IndexField] = new FormControl(ele.ColValues,validation_array);
          }
          ele.selectValues = select_val;
        }
      });
      let group = this.fb.group(dynamic_form);
      this.indexForm.controls['_ColNameList'] = group;
    });
  }

  get dynamicFieldsControl () {
    this.indexForm.updateValueAndValidity();
    return this.indexForm.get('_ColNameList');
  }

  getBranchList() {
    this._processService.getBranchList().subscribe((data: {}) => {
     this.branchList = data;
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  backToIndex() {
    this.router.navigate(['process/indexing'])
  }

  onSave() {
    var submit_data = this.indexForm.value
    submit_data.FieldValues = []
    var obj = {}
    Object.keys(this.indexForm.get('_ColNameList').value).forEach(key => {  
      if(this.indexForm.get('_ColNameList').value[key] instanceof Date) {
        const dateObj = this.indexForm.get('_ColNameList').value[key];
        const dd = dateObj.getDate() > 9 ? '' + dateObj.getDate() : '0' + dateObj.getDate();
        const mm = dateObj.getMonth() + 1 > 9 ? '' + parseInt(dateObj.getMonth() + 1) : '0' + parseInt(dateObj.getMonth() + 1);
        const yyyy = dateObj.getFullYear();
        obj[key] = dd + '-' + mm + '-' + yyyy;
        this.indexForm.get('_ColNameList').value[key] = dd + '-' + mm + '-' + yyyy;
      } else {   
        obj[key] = this.indexForm.get('_ColNameList').value[key]
      }
    })
    submit_data.FieldValues.push(obj)

    this.indexForm.patchValue({
      currentPage: 1,
      
      PageCount: 0,
      CreatedBy: localStorage.getItem('UserID') || 1,
      di: this.indexForm.value,   
      FVals: this.indexForm.value.FieldValues,         
      });
    this._processService.saveIndexData(this.indexForm.value).subscribe(res=> {
      this.toaster.show('success', 'Saved!', 'Records saved succesfully!');
    });
  }
}
