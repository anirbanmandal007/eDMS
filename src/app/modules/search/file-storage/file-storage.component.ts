import { Component, OnInit, TemplateRef,EventEmitter,Output } from "@angular/core";
//import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';

import { FormGroup, FormBuilder, Validators} from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { SearchService } from "../search.service";
import { ToasterService } from "app/shared/toaster/toaster.service";
import { ConfirmationDialogComponent, ConfirmDialogModel } from 'app/shared/confirmation-dialog/confirmation-dialog.component';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
//import { MdbTableDirective, MdbTablePaginationComponent } from 'angular-bootstrap-md';
import { TreeNode } from 'primeng/api';

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
  
}

@Component({
  selector: 'app-file-storage',
  templateUrl: './file-storage.component.html',
  styleUrls: ['./file-storage.component.scss']
})
export class FileStorageComponent implements OnInit {
 // @ViewChild(MdbTableDirective, { static: true }) mdbTable: MdbTableDirective;
  //@ViewChild(MdbTablePaginationComponent, { static: true }) mdbTablePagination: MdbTablePaginationComponent;

  elements: any = [];

  searchText: string = '';
  previous: string;

  maxVisibleItems: number = 8;

  dtOptions: DataTables.Settings = {};

  isShowDivIf = false;

  entries: number = 20;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  //modalRef: BsModalRef;

  _isDownload: any = false;
  _isDelete: any = false;
  _isEmail: any = false;
  _ShareLink: any = false;
  _TemplateList: any;
  _HeaderList: any;
  _DeptList: any;
  _FileList: any;
  _Records: any;
  FileStorageForm: FormGroup;
  submitted = false;
  Reset = false;
  sMsg: string = '';
  _TempID: any = 0;
  _TagDetailsList: any;
  _FileNo: any = "";
  TempField:any =localStorage.getItem('Fname');
  _FilteredList = []
  _LogList: any;
  _StatusRptList: any;
  _DepartmentList: any;
  _BranchList: any;
  _ColNameList: any;
  _IndexList: any;
  FolderStructureForm: FormGroup;
  _SearchByList: any;
  entriesLog: number = 10;
  entriesMD: number = 10;
  entriesversion: number = 10;
  activeRowVersion:any;
  _DocTypeList: any;
  _LogFilteredList: any;
  _MDFilteredList: any;
  _MDList: any;
  TemplateList: any;
  activeRowlog: any;
  activeRowMD: any;
  selectedlog: any[] = [];
  selectedMD: any[] = [];
  selectedVersion: any[] = [];
  _DepartmentID: any;
  _ColList: any;
  _DocName: any;
  myFiles: string[] = [];
  _DocID: any;
  Foder_Structure = [];
  demo = false;
  data: any = [];
  columns: any = [];
  headElements = [];
  _FilteredListInfo: any;
  _FileNoList: any;
  FilePath: any;
  _TempFilePath:any;
  // onActivateInfo:any;
  // entriesInfo:any;
  entriesInfo: number = 10;
  selectedInfo: any[] = [];
  activeRowInfo: any;
  treeFiles: TreeNode[];
  formattedData: any;
  _VersionFilteredList:any;
  _VList:any;
  _isEdit:any;
  _TempD:any;
  first = 0;
  rows = 10;
  fileExt:any;
  
  tableHeader: any = [
    { field: 'userId', header: 'Uplaod By', index: 2 },
    { field: 'EntryDate', header: 'Upload On', index: 3 },
    { field: 'PageCount', header: 'Pages', index: 4 }
  ];

  selectedFiles: TreeNode[];
  selectedRows = [];
  selectAllRows: boolean = false;

  bsValue = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();
  selectAllTaggingRows: boolean = false;
  fileStorageTableData: any;
  metadataList: any;
  immutableFormattedData: any;
  loading: boolean = true;

  constructor(
    private searchService: SearchService,
    private formBuilder: FormBuilder,
    public toaster: ToasterService,
  ) { }

  ngOnInit(): void {
    this.FileStorageForm = this.formBuilder.group({
      FileNo: ['', Validators.required],
      searchText: [],
      TemplateID:[0, Validators.required],
      DeptID: [0, Validators.required],
      BranchID: [0],
      _ColNameList: this._ColNameList,
      Viewer: [''],
      currentPage: 0,
      PageCount: 0,
    //  tickets: new FormArray([]),
      SerchBy: [''],
      DocID: [''],
      SearchByID: [],
      ACC: [''],
      MFileNo: [''],
      DocuemntType: [''],
      ToEmailID:[''],
      ValidDate:[''],
      IsAttachment:[''],
    });
    this.getTemplate();
    this.GetFileInfo('');
  }

  getTemplate() {
    //const apiUrl = this._global.baseAPIUrl + 'TemplateMapping/GetTemplateMappingListByUserID?UserID='+localStorage.getItem('UserID')+'&user_Token='+localStorage.getItem('User_Token');
    this.searchService.GetTemplateAPI().subscribe((data: {}) => {
      this.TemplateList = data;    
         
      this._TempD = data[0].TemplateID;
      // this.getSearchResult(data[0].TemplateID);
      this.FileStorageForm.controls['TemplateID'].setValue(this._TempD);  
      this.geTemplateNameListByTempID(this._TempD);
    });
  }
  geTemplateNameListByTempID(TID: number) {
    this.getSearchResult();
   
    this.GetFileInfo('');
  }

  getSearchResult() {
    //const apiUrl = this._global.baseAPIUrl + 'Status/GetTreeStructure?UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token') + '&TemplateID=' + this.FileStorageForm.get('TemplateID').value
    this.searchService.getSearchResultAPI(this.FileStorageForm.get('TemplateID').value).subscribe((data: [any]) => {
      data.forEach((el, index) => {
        el.SRNO = index + 1;
      })

      let branchs = [];
      let branchDocCount = 0
      let accountDocCount = 0
      var data1: any;

      data.forEach((row, indx) => {
        let inBranchArray = branchs.some(b => b.BranchName == row.BranchName)
        if (!inBranchArray) {
          let files = []
          let DocTypes = [{ DocType: row.DocType, documentCount: row.DocCount, Files: files, isExpanded: false }]
          let Accounts = [{ AccNo: row.AccNo, documentCount: 1, DocTypes: DocTypes, isExpanded: indx == 0 ? true : false }]
          branchs.push({ BranchName: row.BranchName, Accounts: Accounts, documentCount: 1, isExpanded: indx == 0 ? true : false })
        } 
        else {
          let branch = branchs.find(b => b.BranchName == row.BranchName)
          let inAccountsArray = branch.Accounts.some(b => b.AccNo == row.AccNo)
          if (!inAccountsArray) {
            let files = []
            let DocTypes = [{ DocType: row.DocType, documentCount: row.DocCount, Files: files, isExpanded: false }]
            let Account = { AccNo: row.AccNo, documentCount: 1, DocTypes: DocTypes, isExpanded: false }
            branch.Accounts.push(Account)
            branch.documentCount += 1
          } else {
          }
        }
        
      });
      this.Foder_Structure = branchs;
      this.prepareTreeStructure(data);
    });
  }
  prepareTreeStructure(folderStructureData: any) {

    let deptName = [];
    let rootFolder = [];

    folderStructureData.forEach((row, indx) => {
      let inRootFolder = rootFolder.some(b => b.rootFolderName == row.RootfolderName);
      if(!inRootFolder) {
        let root = {rootFolderName: row.RootfolderName, dept: [{deptName: row.DepartmentName, branches: [{branchName: row.BranchName, subFolder: [{subFolderName: row.SubfolderName}]}]}]};
        rootFolder.push(root);
      } else {
        let inDeptNameInRootFolder = rootFolder.find(b => b.rootFolderName == row.RootfolderName).dept.find(b => b.deptName === row.DepartmentName)
        if(!inDeptNameInRootFolder) {
          rootFolder.filter(b => b.rootFolderName == row.RootfolderName)[0].dept.push({deptName: row.DepartmentName, branches: [{branchName: row.BranchName, subFolder: [{subFolderName: row.SubfolderName}]}]});
        } else {
          let isBranchesInDeptName = rootFolder.find(b => b.rootFolderName == row.RootfolderName).dept.filter(b => b.deptName === row.DepartmentName)[0].branches.find(b => b.branchName == row.BranchName);
          if(!isBranchesInDeptName) {
            rootFolder.find(b => b.rootFolderName == row.RootfolderName).dept.filter(b => b.deptName === row.DepartmentName)[0].branches.push({branchName: row.BranchName, subFolder: [{subFolderName: row.SubfolderName}]});
          } else {
            let isSubfolderInBranch = rootFolder.find(b => b.rootFolderName == row.RootfolderName).dept.filter(b => b.deptName === row.DepartmentName)[0].branches.filter(b => b.branchName == row.BranchName)[0].subFolder.find( b => b.subFolderName == row.SubfolderName);
            if(!isSubfolderInBranch) {
              rootFolder.find(b => b.rootFolderName == row.RootfolderName).dept.filter(b => b.deptName === row.DepartmentName)[0].branches.filter(b => b.branchName == row.BranchName)[0].subFolder.push({subFolderName: row.SubfolderName});
            }
          }
        }
      }
    });
  let data = [];
  const parsedData = rootFolder;
  parsedData.forEach(el => {
    let elData = {
      "label": el.rootFolderName ? el.rootFolderName + ' (' + el.dept.length + ')' : 'Root' + ' (' + el.dept.length + ')',
      "data": el.rootFolderName,
      "expandedIcon": "fa fa-folder-open",
      "collapsedIcon": "fa fa-folder",
      "children": []
    }

    el.dept.forEach(dept => {
      let branchElData = {
        //"label": accEl.AccNo + '(' + accEl.documentCount + ')',
        "label": dept.deptName + ' (' + dept.branches.length + ')',
        "data": dept.deptName,
        "expandedIcon": "fa fa-folder-open",
        "collapsedIcon": "fa fa-folder",
        "children": []
      };

      dept.branches.forEach(element => {
        let entityData = {
          //"label": accEl.AccNo + '(' + accEl.documentCount + ')',
          "label": element.branchName+ '(' + element.subFolder.length + ')',
          "data": element.branchName,
          "expandedIcon": "fa fa-folder-open",
          "collapsedIcon": "fa fa-folder",
          "children": []
        };

        element.subFolder.forEach(el => {
          const subFolderData = {
            "label": el.subFolderName,
            "data": el.subFolderName,
            "expandedIcon": "fa fa-folder-open",
            "collapsedIcon": "fa fa-folder",
            "children": []
          }
          entityData.children.push(subFolderData);
        });
        branchElData.children.push(entityData);
      });
      elData.children.push(branchElData);
    })
    data.push(elData);
  })
  //  console.log("Tree data",data);

  this.treeFiles = data;
}
  nodeSelect(e) {
    // console.log("You have selected " + e.node.data);
    // console.log("You have selected " + e.originalEvent.currentTarget.querySelector('span:last-child span').textContent);
    const isNodeSelect = true;
    const fileInfo = {
      fileNo: e.originalEvent.currentTarget.querySelector('span:last-child span').textContent.split('(')[0],
      parentFileNo: e.originalEvent.currentTarget.querySelector('span').closest('ul').previousSibling && e.originalEvent.currentTarget.querySelector('span').closest('ul').previousSibling.querySelector('span:last-child span') 
      ? e.originalEvent.currentTarget.querySelector('span').closest('ul').previousSibling.querySelector('span:last-child span').textContent.split('(')[0] : ''
    }
    this.GetFileInfo(fileInfo, isNodeSelect);

  }

  nodeUnselect(e) {
    alert("Node" + e.node.data + "Unselected");
  }

  GetFileInfo(fileInfo: any, isNodeSelect?) {

    this.selectedRows = [];
    //const apiUrl = this._global.baseAPIUrl + 'Status/GetFileStorageData?UserID=' + localStorage.getItem('UserID') + '&FileNo=' + fileInfo.fileNo + '&parentFileNo=' + fileInfo.parentFileNo + '&user_Token=' + localStorage.getItem('User_Token')+ '&TemplateID=' + this.FileStorageForm.get('TemplateID').value
       
    this.searchService.GetFileInfoAPI(fileInfo,this.FileStorageForm.get('TemplateID').value).subscribe((data: {}) => {
      // this._ColNameList = data;
      this.fileStorageTableData = JSON.parse(JSON.stringify(data));
      this.GetMetadataField();
      // this.prepareTableData(data);
      this._FileNoList = data;
      this._FilteredListInfo = data;
      this._FilteredListInfo.push(data);
   
    });
  }
  GetMetadataField() {
    //const apiUrl=this._global.baseAPIUrl+'DataUpload/GetFieldsName?ID='+ this.FileStorageForm.get('TemplateID').value +'&user_Token='+ localStorage.getItem('User_Token') 
    this.searchService.GetMetadataFieldAPI(this.FileStorageForm.get('TemplateID').value).subscribe((data: {}) => {     
      this.metadataList = data;
     this.TempField = data[0].DisplayName;
      this.prepareTableData(this.fileStorageTableData);
    });
  }

  prepareTableData(data) {
    var formattedData = [];
    let metadataTableHeader = [];
console.log(data);
    
    data.forEach((el, index) => {
      if (el.FileNo) {

        formattedData.push({
          "fileNo": el.FileNo,
          "USERID": el.USERID,
          "EntryDate": el.EntryDate,
          // "fileSize": (el.FileSize) + ' MB',
          "PageCount": el.PageCount,
          "IsIndexing": el.IsIndexing,
          "BranchName": el.BranchName,
          "DepartmentName": el.DepartmentName,  
          "SubfolderName": el.SubfolderName,   
          "FilePath": el.FilePath,   
        });
      }

    });
    this.tableHeader = [
      { field: 'fileNo', header: this.TempField, index: 1 },
      { field: 'DepartmentName', header: 'CABINET', index: 1 },
      { field: 'BranchName', header: 'FOLDER', index: 1 },
      { field: 'SubfolderName', header: 'SUBFOLDER', index: 3 },
      { field: 'USERID', header: 'CREATE BY', index: 2 },
      { field: 'EntryDate', header: 'CREATE DATE', index: 3 },
      { field: 'PageCount', header: 'PAGE COUNT', index: 5 },
      { field: 'IsIndexing', header: 'IS INDEXING', index: 5 },
    ];
    Array.prototype.push.apply(metadataTableHeader, this.tableHeader);
    this.tableHeader = metadataTableHeader;
    this.formattedData = formattedData;
    this.immutableFormattedData = JSON.parse(JSON.stringify(this.formattedData));
    //console.log(JSON.stringify(this.formattedData));
    this.loading=false;
  }
  DownloadMetadata() {
   
    let _CSVData = "";
  for (let j = 0; j < this.selectedRows.length; j++) {          
    _CSVData += this.selectedRows[j] + ',';
  }

  this.FileStorageForm.patchValue({
    ACC: _CSVData
  });

  //const apiUrl = this._global.baseAPIUrl + 'Status/GetMetaDataFileNo';
     
 // this._onlineExamService.postData(this.ContentSearchForm.value, apiUrl)

 // const apiUrl = this._global.baseAPIUrl + 'Status/GetMetaDataReportByFileNo?FileNo=' + _CSVData + '&user_Token=' + localStorage.getItem('User_Token')+'&UserID='+localStorage.getItem('UserID')
  //const apiUrl = this._global.baseAPIUrl + 'Status/GetMetaDataReportByFileNo?FileNo=' + _CSVData + '&user_Token=' + localStorage.getItem('User_Token')
  this.searchService.DownloadMetadataAPI(this.FileStorageForm.value).subscribe((data: {}) => {
    this._MDList = data;
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
    dwldLink.setAttribute("download", 'Metadata' + ".csv"); 
    dwldLink.style.visibility = "hidden"; 
    document.body.appendChild(dwldLink); 
    dwldLink.click(); 
    document.body.removeChild(dwldLink);
  });

}
GetHeaderNames(){
  this._HeaderList = "";
  console.log(this.tableHeader);

  for (let j = 0; j < this.metadataList.length; j++) {
    this._HeaderList +=
      this.metadataList[j].DisplayName +
      (j <= this.metadataList.length - 2 ? "," : "");
    // headerArray.push(headers[j]);
  }

  for (let j = 1; j < this.tableHeader.length; j++) {
    //  this._HeaderList += this.tableHeader[j].DisplayName +((j <= this.metadataList.length-2)?',':'') ;
    this._HeaderList += "," + this.tableHeader[j].header;
    // headerArray.push(headers[j]);
  }

  // console.log(this._MDList);

  this._HeaderList += "\n";
  let that = this;
  this._MDList.forEach((stat) => {
    // console.log(stat);
    //console.log(stat.BranchName);
    // if ( that.selectedRows.indexOf(stat['Ref1']) > -1 ) {
    for (let j = 0; j < this.metadataList.length; j++) {
      this._HeaderList +=
        (j == 0 ? stat["Ref" + (j + 1)] + "" : stat["Ref" + (j + 1)]) +
        (j <= this.metadataList.length - 2 ? "," : "");
    }
    var counter = 0;
    //  console.log(this._HeaderList);

    //  this._HeaderList += stat[(this.tableHeader[counter].field)] + ',';
    //  this._HeaderList +=stat.DepartmentName + ',';
    //  this._HeaderList +=stat.BranchName + ',';
    //  this._HeaderList +=stat.USERID + ',';
    //  this._HeaderList +=stat.EntryDate + ',';
    //  this._HeaderList +=stat.PageCount + ',';
    //  this._HeaderList +=stat.IsIndexing + ',';

    for (
      let j = this.metadataList.length;
      j < this.tableHeader.length + this.metadataList.length;
      j++
    ) {
      //  this._HeaderList += this.tableHeader[j].DisplayName +((j <= this.metadataList.length-2)?',':'') ;
      this._HeaderList += stat[this.tableHeader[counter].field] + ",";
      // console.log(stat);
      ///   console.log("Field Name",this.tableHeader[counter].field);

      counter++;
      //console.log(stat);
      // headerArray.push(headers[j]);
    }

    // }
    this._HeaderList += "\n";
  });

  console.log("this._HeaderList", this._HeaderList);
}

  onHeaderCheckboxToggle(event) {
    console.log("event",event);
 }
 paginate(e) {
  this.first = e.first;
  this.rows = e.rows;
}
filterFolderTable($event) {
  // console.log($event.target.value);

  let val = $event.target.value;
  if(val == '') {
    this.formattedData = this.immutableFormattedData;
  } else {
      let filteredArr = [];
      this.immutableFormattedData.filter(d => {
      for (var key in d) {
        const strArr = val.split(',');
        strArr.forEach(el => {
          if (d[key] && el!== '' && d[key].toLowerCase().indexOf(el.toLowerCase()) !== -1) {
            if (filteredArr.filter(el => el.fileNo === d.fileNo).length === 0) {
              filteredArr.push(d);
            }
          }
        });
      }
    });
    this.formattedData = filteredArr;
    this.loading = false;
  }
}
}
