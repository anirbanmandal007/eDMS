import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  dynamicFIelds: any;

  constructor(
    private _processService: ProcessService,
    private _activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this._activatedRoute.params.subscribe(params => {
      this.fileNo = params['id'];
      this._processService.getIndexingFile(this.fileNo).subscribe(res => {
        this.doc = res;
      })
    });
    this.getTemplates();
    this.getBranchList();
    this.initiateIndexForm();
  }

  initiateIndexForm() {
    this.indexForm = this.fb.group({
      templateName: ['', Validators.required],
      branchName: ['', Validators.required]
    });
  }

  getTemplates() {
    this._processService.getTemplates().subscribe((data: {}) => {
      this._TemplateList = data;
      this.selectedTemplate = data[0]?.TemplateName;
    });
  }

  getFields() {
    const tempId = this.indexForm.controls['templateName'].value;
    this._processService.getFields(tempId, this.fileNo).subscribe(res => {
      this.dynamicFIelds = res;
    });
  }

  getBranchList() {
    this._processService.getBranchList().subscribe((data: {}) => {
     this.branchList = data;
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }
}
