import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MasterService } from '../master.service';


@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {
  @ViewChild('openmenu') toggleButton: ElementRef;
  @ViewChild('data-menu') menu: ElementRef;
  dataSource: any;
  displayTable: boolean;
  dtOptions: any;
  selectedId: any;
  openlist: boolean = false;
  _TemplateList :any; 

  createmodalopen:boolean = false; 
  _PageTitle:any = "Add new template";
  constructor(
    private _masterService: MasterService
  ) {}

  ngOnInit(): void {
    this.geTempList();
  }
  openMenu(id:any){
    this.selectedId = id;
    this.openlist = true;
  }
  


  geTempList() {
    this._masterService.getTempListData().subscribe((data: {}) => {     
    this._TemplateList = data;
    console.log(this._TemplateList);
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

  createTemplate(){
    this.createmodalopen=true;
     //this.modalopen = true;
     //this.createmodalopen  = true;
   }

   closeDialog(){
    this.openlist = false;
    this.createmodalopen = false;
  }

   @HostListener('document:click', ['$event'])
    clickout(event) {
      if(event.target && event.target.innerText !== 'more_vert') {
        this.openlist = false;
      }
    }
}
