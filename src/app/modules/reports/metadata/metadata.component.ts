import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { reportsService } from '../reports.service';
import { ToasterService } from 'app/shared/toaster/toaster.service';
@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.scss']
})
export class MetadataComponent implements OnInit {
  MetaDataForm:FormGroup;
  uid: any;
  private _RootList: {};
  BranchList: any;
  _DepartmentList:any = {};
  _FilteredList: any;
  _StatusList: any;
  TemplateList:any = {};
  _ColNameList:any;
  _HeaderList: string;
  displayTable:boolean = false;
  constructor( private __formBuilder: FormBuilder,
    private __reportservice:reportsService,
    private toaster: ToasterService) { }

  ngOnInit(): void {
    let userData = localStorage.getItem('userData');
    this.uid = JSON.parse(userData).id;
    this.MetaDataForm = this.__formBuilder.group({
     
      TemplateID: [0, Validators.required],  
      User_Token: localStorage.getItem('User_Token') , 
      BranchID:['0'],
      DeptID:['0'],
      SubfolderID:[0], 
      RootID:[0],
      userID: this.uid ,
  
    });
    this.getTemplate();
    this.getDepartmnet();
  }
  getRootList() {
    this.__reportservice.GetRootByUserID(this.uid).subscribe((data: {}) => {     
      this._RootList = data;
   this.MetaDataForm.controls['DeptID'].setValue(0);
   this.MetaDataForm.controls['BranchID'].setValue(0);
   this.MetaDataForm.controls['SubfolderID'].setValue(0);  
    });
  }


  geBranchListByUserID(userid: number) {
    this.geBranchList(userid);
  }

  geBranchList(userid: any) {
    this.__reportservice.GetBranchByDeptIDANDUserwise(this.uid,userid).subscribe((data: any) => {
      this.BranchList = data;
    });
  }

  getDepartmnet() {

    this.__reportservice.getCustomer(this.uid).subscribe((data: {}) => {
    this._DepartmentList = data;
    this.MetaDataForm.controls['DeptID'].setValue(0);
    this.MetaDataForm.controls['BranchID'].setValue(0);
    });

    }
  filterTable($event) {
       
       let val = $event.target.value;
       this._FilteredList = this._StatusList.filter(function (d) {
         for (var key in d) {
           if(
             key == 'FileNo'||
             key == 'Ref2'||
             key == 'Ref3'||
             key == 'Ref4'||
             key == 'Ref5'||
             key == 'Ref6'||
             key == 'Ref7'||
             key == 'Ref8'||
             key == 'Ref9'||
             key == 'Ref10'||
             key == 'Ref11'||
             key == 'Ref12'||
             key == 'Ref13'||
             key == 'Ref14'||
             key == 'Ref15'||
             key == 'Ref16'||
             key == 'Ref17'||
             key == 'Ref18'||
             key == 'Ref19'||
             key == 'Ref20') {
             if (d[key] && d[key].toLowerCase().indexOf(val) !== -1) {
               return true;
             }
           }
         }
         return false;
       });
     }
  getTemplate() {  

    
    this.__reportservice.getTemplateData(this.uid).subscribe((data: {}) => {     
    this.TemplateList = data;  
    this.MetaDataForm.controls['TemplateID'].setValue(0);
});
}
 
  getMetdataList() {  

      console.log("this.MetaDataForm.value",this.MetaDataForm.value);
             
    this.__reportservice.GetMetaDataReport(this.MetaDataForm.value)
    // .pipe(first())

    .subscribe( data => {
      this._StatusList = data;     
      this._FilteredList = data;     
      this.GetHeaderNames();
     
    });
  }
  
  onSearch()
  {
    this.getMetdataList();
  }
  onDownload()
  {
    this.downloadFile();
  } 
  geTemplateNameListByTempID(TID:number)
  {
        this.GetDisplayField(TID);
  }
  
  GetDisplayField(TID:number) {  

    this.__reportservice.GetFieldsName(TID).subscribe((data: {}) => {     
    
     this._ColNameList = data;
     this.displayTable = true;
});
}

GetHeaderNames()
{
  this._HeaderList="";
  for (let j = 0; j < this._ColNameList.length; j++) {  
       
      this._HeaderList += this._ColNameList[j].DisplayName +((j <= this._ColNameList.length-2)?',':'') ;
    // headerArray.push(headers[j]);  
  }
  this._HeaderList +=','+"PageCount"
  this._HeaderList +=','+"Folder"
  this._HeaderList +=','+"SubFolder"
  this._HeaderList += '\n'
  this._StatusList.forEach(stat => {
    for (let j = 0; j < this._ColNameList.length; j++) {  
       
      this._HeaderList += (j==0?(stat['FileNo']+''):stat['Ref'+(j+1)]) + ((j <= this._ColNameList.length-2)?',':'') ;
      // headerArray.push(headers[j]);  
    }
    this._HeaderList +=',' +stat.PageCount; 
    this._HeaderList +=',' +stat.BranchName; 
    this._HeaderList +=',' +stat.SubfolderName; 
    this._HeaderList += '\n'
  });
  

}

downloadFile() { 
  if(this._StatusList.length>0) {
    this.GetHeaderNames();
    let csvData = this._HeaderList; 
   // alert(this._HeaderList);
   // console.log("Data",csvData) 
    let blob = new Blob(['\ufeff' + csvData], { 
        type: 'text/csv;charset=utf-8;'
    }); 
    let dwldLink = document.createElement("a"); 
    let url = URL.createObjectURL(blob);
    
    let isSafariBrowser =-1;
    // let isSafariBrowser = navigator.userAgent.indexOf( 'Safari') != -1 & amp; & amp; 
    // navigator.userAgent.indexOf('Chrome') == -1; 
    
    //if Safari open in new window to save file with random filename. 
    if (isSafariBrowser) {  
        dwldLink.setAttribute("target", "_blank"); 
    } 
    dwldLink.setAttribute("href", url); 
    dwldLink.setAttribute("download", 'data' + ".csv"); 
    dwldLink.style.visibility = "hidden"; 
    document.body.appendChild(dwldLink); 
    dwldLink.click(); 
    document.body.removeChild(dwldLink); 
  } else {
    this.toaster.show('error', 'Error!', 'There should be some data before you download!');
  }
  
}

isValid() {
  return this.MetaDataForm.valid 
}
}
