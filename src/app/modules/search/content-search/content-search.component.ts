import {
  Component,
  OnInit,
  TemplateRef,
  EventEmitter,
  Output,
} from "@angular/core";
//import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';

import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { HttpEventType, HttpClient } from "@angular/common/http";
import { saveAs } from "file-saver";
import { SearchService } from "../search.service";
import { ToasterService } from "app/shared/toaster/toaster.service";
import {ConfirmationDialogComponent,ConfirmDialogModel,} from "app/shared/confirmation-dialog/confirmation-dialog.component";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { SharedService } from "app/shared/shared.service";

declare var $: any;

export enum SelectionType {
  single = "single",
  multi = "multi",
  multiClick = "multiClick",
  cell = "cell",
  checkbox = "checkbox",
}
@Component({
  selector: "app-content-search",
  templateUrl: "content-search.component.html",
  styleUrls: ["content-search.component.scss"],
})
export class ContentSearchComponent implements OnInit {

  
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  _FilteredList: any;
  _TemplateList: any;
  TemplateList: any;
  ContentSearchForm: FormGroup;
  submitted = false;
  Reset = false;
  sMsg: string = "";
  //UploadDocForm: FormGroup;
  _SingleDepartment: any;
  _ColNameList: any;
  _DepartmentList: any;
  _BranchList: any;
  BranchList: any;
  _FileNo: any = "";
  _PageNo: number = 1;
  FilePath: any = "../assets/1.pdf";
  _TempFilePath: any;
  _isDownload: any;
  _isDelete: any;
  _TotalPages: any = 0;
  _SearchByList: any;
  userID = 1;
  TempField: any = localStorage.getItem("FileNo");
  _isEmail: any = true;
  _ShareLink: any = true;
  _isEdit: any = true;
  _DocTypeList: any;
  _FileList: any;
  _DocName: any;
  myFiles: string[] = [];
  _DocID: any;
  _MDList: any;
  _IndexList: any;
  _TempD: any;
  EntityList: any;
  _isDocView: any = true;
  first = 0;
  rows = 10;

  _RootList: any;
  today = new Date();
  fileExt: any;

  _FileDetails: string[][] = [];
//pop up modal
  modalopen: boolean = false;
  EmailFormPopup: boolean =  false;
  ShareLinkFormPopup: boolean =  false;
  @Output() public onUploadFinished = new EventEmitter();

  constructor(
    private dialog: MatDialog,
    private searchService: SearchService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private httpService: HttpClient,
    public toaster: ToasterService,
    private route: ActivatedRoute,
    private router: Router,
    private shareService: SharedService,
    private _activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getRights(JSON.parse(localStorage.getItem("userData"))?.id);
    document.body.classList.add("CS");
    this.ContentSearchForm = this.formBuilder.group({
      FileNo: ["", Validators.required],
      TemplateID: [0, Validators.required],
      _ColNameList: this._ColNameList,
      User_Token: localStorage.getItem("User_Token"),
      CreatedBy: localStorage.getItem("UserID"),
      Viewer: [""],
      currentPage: [0],
      PageCount: [0],
      //tickets: new FormArray([]),
      SerchBy: [""],
      DocID: [""],
      SearchByID: [],
      userID: localStorage.getItem("UserID"),
      ACC: [""],
      MFileNo: [""],
      DocuemntType: [""],
      AccNo: [""],
      ToEmailID: ["", [Validators.required, Validators.email]],
      ValidDate: [""],
      IsAttachment: [""],
      BranchID: ["0"],
      DeptID: ["0"],
      SubfolderID: [0],
      RootID: [0],
    });
    this.getTemplate();
    this._PageNo = 1;

    //  this.GetEntityList();
    //this.getSearchResult(0);
    //  this.getSearchParameterList(0);
    //this.getDoctypeListByTempID(1);

    //TODO
    // this._commonService.hasRightListChanged.subscribe(res => {
    //   if(res) {
    //     this._isDownload = res.filter(el => el.page_right === 'Download')[0].isChecked ? 'true' : false;
    //     this._isDelete = res.filter(el => el.page_right === 'Delete')[0].isChecked ? 'true' : false;
    //     this._isEmail = res.filter(el => el.page_right === 'Email')[0].isChecked ? 'true' : false;
    //     this._ShareLink = res.filter(el => el.page_right === 'Link')[0].isChecked ? 'true' : false;
    //     this._isEdit = res.filter(el => el.page_right === 'Edit')[0].isChecked ? 'true' : false;
    //     this._isDocView = res.filter(el => el.page_right === 'Document View')[0].isChecked ? 'true' : false;
    //   }
    // });

    this.getBranchList();
    //this.getDepartmnet();
    // this.getRootList();
    // this.filteredOptions = this.myControl.valueChanges.pipe(
    //   startWith(''),
    //   map(value => this._filter(value)),
    // );
    // console.log("hhh",this.filteredOptions);
  }

  getRights(id: any) {
    this.shareService.getAllRights(id).subscribe((data) => {
      console.log(data);
      this._isDownload = data.filter(
        (el) => el.page_right === "Download"
      )[0]?.isChecked;
      this._isDelete =  data.filter(
        (el) => el.page_right === "Delete"
      )[0]?.isChecked;
      this._isEmail = data.filter(
        (el) => el.page_right === "Email"
      )[0]?.isChecked;
      this._ShareLink =  data.filter(
        (el) => el.page_right === "Link"
      )[0]?.isChecked;
      
      this._isEdit = data.filter(
        (el) => el.page_right === "Edit"
      )[0]?.isChecked;
      this._isDocView = data.filter(
        (el) => el.page_right === "Document View"
      )[0]?.isChecked;
    });
  }

  // _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();

  //   return this._RootList.filter(option => option.toLowerCase().includes(filterValue));
  // }

  getRootList() {
    this.searchService.GetRootByUserID().subscribe((data: {}) => {
      this._RootList = data;
      //  this.filteredOptions=  JSON.parse(JSON.stringify(data));
      //  this._FilteredList = data
      this.ContentSearchForm.controls["DeptID"].setValue(0);
      this.ContentSearchForm.controls["BranchID"].setValue(0);
      this.ContentSearchForm.controls["SubfolderID"].setValue(0);
      //console.log(this._FilteredList );
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  geBranchListByUserID(userid: number) {
    //     alert(this.BranchMappingForm.value.UserID);
    this.geBranchList(userid);
  }

  geBranchList(userid: any) {
    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    this.searchService
      .GetBranchByDeptIDANDUserwise(userid)
      .subscribe((data: any) => {
        this.BranchList = data;
        //  this._FilteredList = data;
        //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
      });
  }

  DownloadFileAll(_FileNo: any, _File: any) {
    const fileExt = _File.filePath.substring(
      _File.filePath.lastIndexOf("."),
      _File.filePath.length
    );
    this.searchService.DownloadFileFromDB(_FileNo).subscribe((res) => {
      if (res) {
        //      var __FilePath = _TempFilePath ;
        //  console.log("Final FP-- res ", _File);
        saveAs(res, _FileNo + fileExt);
      }
    });
  }

  getDepartmnet(RootID: any) {
    //   const apiUrl=this._global.baseAPIUrl+'Department/GetDepartmentByUserID?user_Token='+ localStorage.getItem('User_Token');
    this.searchService.GetDepartmentByUserID(RootID).subscribe((data: {}) => {
      this._DepartmentList = data;
      // this._DepartmentLists=data;
      //    console.log("data : -", data);
      this.ContentSearchForm.controls["DeptID"].setValue(0);
      this.ContentSearchForm.controls["BranchID"].setValue(0);
      // this.RegionMappingForm.controls['DeptIDS'].setValue(0);

      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  // GetEntityList() {
  //   //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
  //   const apiUrl =
  //     this._global.baseAPIUrl +
  //     "SubfolderController/GetSubfolderList?ID=" +
  //     localStorage.getItem('UserID') +
  //     "&user_Token=" +
  //     this.ContentSearchForm.get("User_Token").value;
  //   this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
  //     this.EntityList = data;

  //     this.ContentSearchForm.controls['SubfolderID'].setValue(0);
  //    // this._EntityFilteredList = data;
  //     //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
  //   });
  // }

  // GetEntityList() {
  //   //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
  //   const apiUrl =
  //     this._global.baseAPIUrl +
  //     "SubFolderMapping/GetSubFolderDetailsUserWise?ID=" +
  //     localStorage.getItem('UserID')  +
  //     "&user_Token=" +
  //     this.ContentSearchForm.get("User_Token").value;
  //   this._onlineExamService.getAllData(apiUrl).subscribe((data: any) => {
  //     this.EntityList = data;
  //     this.ContentSearchForm.controls['SubfolderID'].setValue(0);
  //     //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
  //   });
  // }

  getEntityForUser(userid: number) {
    this.getEntity(userid);
  }

  getEntity(userid: number) {
    //   const apiUrl =this._global.baseAPIUrl +"SubFolderMapping/GetDetails?ID="+userid+"&user_Token="+this.EntityMappingForm.get("User_Token").value;;
    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    this.searchService
      .GetSubFolderByBranch(this.ContentSearchForm.get("BranchID").value)
      .subscribe((res) => {
        this.EntityList = res;
        this.ContentSearchForm.controls["SubfolderID"].setValue(0);
        //  this.checkbox_list = [];
        //this.checkbox_list = res;
        //this.checklistArray.clear()
        // this.checkbox_list.forEach(item => {
        //   let fg = this.formBuilder.group({
        //     id: [item.id],
        //     SubfolderName: [item.SubfolderName],
        //     ischecked: [item.ischecked]
        //     })
        //     this.checklistArray.push(fg)
        // });
        //  console.log('Branch Mapping -> ',res);

        // this.itemRows = Array.from(Array(Math.ceil(this.checkbox_list.length/2)).keys())

        //this.productsArray = res;
        //  this.checkbox_list= res;
        //this.checklist =res;
      });
  }

  entriesChange($event) {
    this.entries = $event.target.value;
  }
  filterTable($event) {
    console.log($event.target.value);

    let val = $event.target.value;
    this._FilteredList = this._FileList.filter(function (d) {
      console.log(d);
      for (var key in d) {
        if (key == "AccNo" || key == "BranchName" || key == "DocType") {
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
    this.ContentSearchForm.reset();
  }
  // refreshPage() {
  //   window.location.reload();
  // }

  getSearchParameterList(TID: any) {
    //  const apiUrl=this._global.baseAPIUrl+'SearchFileStatus/getSearchParameterList?user_Token=123123'
    this.searchService.getSearchParameterList(TID).subscribe((data: {}) => {
      this._SearchByList = data;

      this.ContentSearchForm.controls["SearchByID"].setValue(0);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  getDoctypeListByTempID(TID: any) {
    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    //      console.log("apiUrl",apiUrl);
    this.searchService.getDoctypeListByTempID(TID).subscribe((data: {}) => {
      this._DocTypeList = data;
      this.ContentSearchForm.controls["DocID"].setValue(0);
      //  console.log("_DeptList",this._DeptList);
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  geTemplateNameListByTempID(TID: number) {
    this.getSearchParameterList(TID);
    //  this.getDoctypeListByTempID(TID);
    this.getSearchResult(TID);
  }

  GetFilterSearch(tid: any) {
    this.GetFilterData(1);
  }

  getBranchList() {
    //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
    this.searchService.getBranchList().subscribe((data: any) => {
      this.BranchList = data;
      //  this._FilteredList = data;
      //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
    });
  }

  getTemplate() {
    // const apiUrl = this._global.baseAPIUrl + 'Template/GetTemplate?user_Token=' + this.FileStorageForm.get('User_Token').value
    this.searchService
      .GetTemplateMappingListByUserID()
      .subscribe((data: {}) => {
        this.TemplateList = data;
        //  this.ContentSearchForm.controls['TemplateID'].setValue(1);

        this.ContentSearchForm.controls["TemplateID"].setValue(
          data[0] ? data[0].TemplateID : 1
        );
        //this.AddEditBranchMappingForm.controls['UserIDM'].setValue(0);
        //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
        // console.log("TempID",data[0].TemplateID);
        this._TempD = data[0] ? data[0].TemplateID : 1;
        this.getSearchResult(data[0] ? data[0].TemplateID : 1);

        this.getSearchParameterList(this._TempD);
      });
  }

  getSearchResult(tempID: any) {
    //   const apiUrl = this._global.baseAPIUrl + 'TaggingDetails/GetPendingData?UserID=' + localStorage.getItem('UserID') + '&user_Token='+ localStorage.getItem('User_Token');

    //    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/getSearchDataByFolderStructure?UserID=' + localStorage.getItem('UserID') + '&user_Token='+ localStorage.getItem('User_Token');

    // const apiUrl="https://demo2993066.mockable.io/getAllData";
    this.searchService
      .getSearchDataByFolderStructure(tempID)
      .subscribe((data: [any]) => {
        this._FileList = data;
        this._FilteredList = data;
        this.GetDisplayField(tempID);

        // console.log("Loggg",data);
      });
  }

  GetDisplayField(TID: number) {
    this.searchService.GetFieldsName(TID).subscribe((data: {}) => {
      this._ColNameList = data;
      this.prepareTableData(this._FilteredList, this._ColNameList);
    });
  }

  formattedData: any;
  headerList: any;
  immutableFormattedData: any;
  loading: boolean = true;
  prepareTableData(tableData, headerList) {
    let formattedData = [];
    let tableHeader: any = [
      { field: "srNo", header: "SR NO", index: 1 },
      // { field: 'accId', header: 'Acc ID', index: 2 },
      // { field: 'DepartmentName', header: 'CABINET', index: 3 },
      // { field: 'branch', header: 'FOLDER', index: 3 },
      // { field: 'SubfolderName', header: 'SUBFOLDER', index: 3 },
      //  { field: 'TemplateName', header: 'TemplateName', index: 3 },
      //  { field: 'department', header: 'Department', index: 4 },
      //  { field: 'docType', header: 'Doc Type', index: 5 },
      { field: "pageCount", header: "PAGE COUNT", index: 6 },
      { field: "entryDate", header: "CREATE DATE", index: 3 },
      // { field: 'filePath', header: 'File Path', index: 3 },
    ];
    headerList.forEach((el, index) => {
      tableHeader.push({
        field: "metadata-" + parseInt(index + 1),
        header: el.DisplayName,
        index: parseInt(5 + index),
      });
    });
    // console.log("tableData",tableData);
    tableData.forEach((el, index) => {
      formattedData.push({
        srNo: parseInt(index + 1),
        accId: el.Ref1,
        // 'DepartmentName': el.DepartmentName,
        // 'branch': el.BranchName,
        // 'SubfolderName': el.SubfolderName,
        // 'TemplateName': el.TemplateName,
        entryDate: el.EntryDate,
        //  'department': el.DepartmentName,
        // 'docType': el.DocType,
        pageCount: el.DocCount,
        AccNo: el.AccNo,
        TemplateID: el.TemplateID,

        // 'RelPath': el.RelPath,
        // 'FilePath': el.FilePath,
        ACC: el.ACC,
        filePath: el.FilePath,
        //  'DocID': el.DocID,
        // 'profileImg': el.PhotoPath
      });
      headerList.forEach((el1, i) => {
        formattedData[index]["metadata-" + parseInt(i + 1)] =
          el["Ref" + parseInt(i + 1)];
      });
    });
    this.headerList = tableHeader;
    this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
    this.formattedData = formattedData;
    this.loading = false;
  }

  searchTable($event) {
    // console.log($event.target.value);

    let val = $event.target.value;
    if (val == "") {
      this.formattedData = this.immutableFormattedData;
    } else {
      let filteredArr = [];
      const strArr = val.split(",");
      this.formattedData = this.immutableFormattedData.filter(function (d) {
        for (var key in d) {
          strArr.forEach((el) => {
            if (
              d[key] &&
              el !== "" &&
              (d[key] + "").toLowerCase().indexOf(el.toLowerCase()) !== -1
            ) {
              if (filteredArr.filter((el) => el.srNo === d.srNo).length === 0) {
                filteredArr.push(d);
              }
            }
          });
        }
      });
      this.formattedData = filteredArr;
    }
  }

  // DownloadFileAll(_FileNo: any,_File:any) {

  //   const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/DownloadFileFromDB?ID=' + localStorage.getItem('UserID') + '&FileNo= ' + _FileNo + ' &user_Token=' + localStorage.getItem('User_Token');
  //   this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
  //     if (res) {

  //       //      var __FilePath = _TempFilePath ;
  //        console.log("Final FP-- res ", _File);
  //       saveAs(res,_FileNo +".pdf");

  //     }
  //   });

  // }

  //       downloadFile(_fileName: any) {

  //         const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/DownloadFile_Test?ID=' + localStorage.getItem('UserID') + '&_fileName= '+ _fileName +' &user_Token='+ localStorage.getItem('User_Token');
  //         this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
  //           if (res) {

  // //      var __FilePath = _TempFilePath ;
  //   console.log("Final FP-- res ", res);
  //       saveAs(res, _fileName + '.pdf');
  //     // saveAs(__FilePath, _fileName + '.pdf');

  //         //     var url1 = window.URL.createObjectURL(res);
  //         // window.open(url1);
  //         // console.log("download result ", res);

  //             //alert(res);
  //          //   console.log("Res",this._onlineExamService.DownloadFile() + res.FileName);

  //           //   var oReq = new XMLHttpRequest();
  //           //   oReq.open("GET", this._onlineExamService.DownloadFile() + res.FileName, true);
  //           //   oReq.responseType = "blob";

  //           //   var file = new Blob([oReq.response], {
  //           //     type: 'application/pdf'
  //           // });

  //           // saveAs(file, "mypdffilename.pdf");

  //             // const link = document.createElement('a');
  //             // link.href =this._onlineExamService.DownloadFile() + res.FileName; //window.URL.createObjectURL(blob);
  //             // link.download = res.FileName;
  //             // link.click();

  //             // if(this._StatusList.length>0) {
  //             //   let blob = new Blob(['\ufeff' +  csvData], {
  //             //       type: 'text/csv;charset=utf-8;'
  //             //   });
  //               // let dwldLink = document.createElement("a");
  //               // let url =this._onlineExamService.DownloadFile() + res.FileName // URL.createObjectURL(this._onlineExamService.DownloadFile() + res.FileName);
  //               // let isSafariBrowser =-1;
  //               // let isSafariBrowser = navigator.userAgent.indexOf( 'Safari') != -1 & amp; & amp;
  //               // navigator.userAgent.indexOf('Chrome') == -1;

  //               //if Safari open in new window to save file with random filename.
  //               // if (isSafariBrowser) {
  //               //     dwldLink.setAttribute("target", "_blank");
  //               // }
  //               // dwldLink.setAttribute("href", url);
  //               // dwldLink.setAttribute("download",  "PDFFile" + ".pdf");
  //               // dwldLink.style.visibility = "hidden";
  //               // document.body.appendChild(dwldLink);
  //               // dwldLink.click();
  //               // document.body.removeChild(dwldLink);

  //            // window.open(this._onlineExamService.DownloadFile() + res.FileNamel, '_blank', '', true);
  //                 //             let headers = new HttpHeaders();
  //                 // headers = headers.set('Accept', 'application/pdf');
  //                 // return this.http.get(this._onlineExamService.DownloadFile() + res.FileNamel, { headers: headers, responseType: 'blob' });

  //            // window.location.assign(this._onlineExamService.DownloadFile() + res.FileNamel);
  //             //window.location.href = this._onlineExamService.DownloadFile() + res.FileName;
  //             console.log("L----");
  //            // FileSaver.saveAs(pdfUrl, pdfName);
  //            // file saveAs(this._onlineExamService.DownloadFile() + res.FileName,_fileName);
  //             //window.open(this._onlineExamService.DownloadFile() + res.FileName);
  //           }
  //         });

  //       }

  downloadFile(row: any) {
    this.searchService.DownloadTagFile(row).subscribe((res) => {
      if (res) {
        saveAs(res, row.AccNo + ".pdf");
      }
    });
  }

  Setfavourite(FileName: any) {
    this.ContentSearchForm.patchValue({
      ACC: FileName,
      User_Token: localStorage.getItem("User_Token"),
      userID: localStorage.getItem("UserID"),
    });

    this.searchService
      .Setfavourite(this.ContentSearchForm.value)
      .subscribe((data) => {
        this.toaster.show(
          "success",
          "Success!",
          "Doc Type has been added as favourite"
        );
      });
  }

  DeleteFile(Row: any) {
    const message = `Are you sure you want delete?`;
    const dialogData = new ConfirmDialogModel(
      "Confirm Deletion",
      message,
      "Delete",
      "Cancel"
    );

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: "0",
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult) {
        this.deleteFile(Row);
      } else {
      }
    });
  }
  deleteFile(Row: any) {
    this.ContentSearchForm.patchValue({
      ACC: Row.AccNo,
      DocID: Row.DocID,
    });
    this.searchService
      .DeleteFile(this.ContentSearchForm.value)
      .subscribe((data) => {
        this.toaster.show("success", "Deleted!", "File deleted successfully!");
      });
  }
  // Model Popup For Docuemnt Inserstion

  showModal(Row: any): void {
    if (Row != null) {
      this._FileNo = Row.AccNo;
      this._DocID = Row.DocID;
      this._DocName = Row.ACC;
      this.ContentSearchForm.controls["MFileNo"].setValue(this._FileNo);
      this.ContentSearchForm.controls["DocuemntType"].setValue(this._DocName);
    }
    //
    $("#myModal").modal("show");
  }
  sendModal(): void {
    //do something here
    this.hideModal();
  }
  hideModal(): void {
    document.getElementById("close-modal").click();
    //this.getSearchResult();
  }

  ClosePopup(): void {
    //  document.getElementById('close-modal').click();
    //this.getSearchResult();
    //  this.modalRef.hide();
    // this.getSearchResult(this.ContentSearchForm.get('TemplateID').value);
  }

  getFileDetails(e) {
    //console.log (e.target.files);
    this.myFiles = [];
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
      //  console.log("File",this.myFiles);
    }
    let selectedFileNames = "";
    this.myFiles.forEach((el) => {
      selectedFileNames += el["name"] + "<br />";
    });
    $(".selected-file-name").html(selectedFileNames);
    //this._IndexList = e.target.files;
  }

  uploadFiles() {
    const frmData = new FormData();
    const that = this;
    for (var i = 0; i < this.myFiles.length; i++) {
      frmData.append("fileUpload", this.myFiles[i]);
    }

    // this._FileNo =Row.id;
    // this._DocID =Row.DocID;
    // this._DocName = Row.ACC

    frmData.append("DocID", this._DocID);
    frmData.append("AccNo", this._FileNo);
    frmData.append("ACC", this._DocName);
    frmData.append("UserID", localStorage.getItem("UserID"));

    this.searchService.uploadFiles(frmData).subscribe((data) => {
      // SHOW A MESSAGE RECEIVED FROM THE WEB API.
      this.toaster.show("success", "Success!", data);

      that.getSearchResult(that.ContentSearchForm.get("TemplateID").value);
    });
    // this.OnReset();
    // this.getSearchResult(this.ContentSearchForm.get('TemplateID').value);
  }

  // MetaData(Row: any) {

  //   localStorage.setItem('FileNo', Row.AccNo);
  //   localStorage.setItem('DocID', Row.DocID);
  //   localStorage.setItem('TemplateID', Row.TemplateID);
  //   //this.localStorage.setItem('_TempID') =_TempID;
  //   this.router.navigateByUrl('/process/data-entry');

  // }

  OnLoad() {
    this.getSearchResult(this._TempD);
  }

  EditRowData(Row: any) {
    localStorage.setItem("FileNo", Row.AccNo);
    localStorage.setItem("TemplateID", Row.TemplateID);

    //this.localStorage.setItem('_TempID') =_TempID;
    this.router.navigate(["/process/EditIndexing"]);
  }

  MetaData(template: TemplateRef<any>, row: any) {
    //FileNo: localStorage.getItem('FileNo'),
    //  TemplateID:localStorage.getItem('TemplateID')
    let __FileNo = row.AccNo;
    let __TempID = row.TemplateID;

    //const apiUrl=this._global.baseAPIUrl+'DataEntry/GetNextFile?id'+  + '' FileNo='+ __FileNo + '&user_Token=123123'
    this.searchService.GetNextFile(__TempID, __FileNo).subscribe((data: {}) => {
      this._IndexList = data;
      //console.log("Index",data);
    });
    // this.modalRef = this.modalService.show(template);
  }

  closeEmailPopUp() {
    this.modalopen=false;
    this.EmailFormPopup=false;
  }
  closeShareLinkPopUp(){
    this.modalopen=false;
    this.ShareLinkFormPopup=false;
  }
  //   UploadDocModal(template: TemplateRef<any>, row: any) {
  //     var that = this;
  //     that._SingleDepartment = row;
  //    // console.log('data', row);
  //     this._FileNo = row.AccNo;
  //     this._DocID = row.DocID;
  //     this._DocName = row.ACC

  //     if (row != null) {

  //       this.ContentSearchForm.controls['MFileNo'].setValue(this._FileNo);
  //       this.ContentSearchForm.controls['DocuemntType'].setValue(this._DocName);
  //     }

  //     //console.log('form', this.UploadDocForm);
  //     //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
  //   this.modalRef = this.modalService.show(template);
  // }

  ViewDocument(
    template: TemplateRef<any>,
    row: any,
    indexTemplate: TemplateRef<any>
  ) {
    this.MetaData(indexTemplate, row);
    //  this.FilePath = row.RelPath;
    //this._TempFilePath =row.RelPath;
    //TODO
    // this.modalRef = this.modalService.show(template);
    $(".modal-dialog").css("max-width", "1330px");
    this.GetDocumentDetails(row);

    this.GetFullFile(row.AccNo);
  }
  ViewEditDocument(Row: any) {
    this.router.navigate(["/process/indexing/view/" + Row.AccNo]);
    this.router.navigate(['/process/indexing/view/', Row.AccNo], {relativeTo:this._activatedRoute, state: { rowData: Row }});
  }

  GetFullFile(FileNo: any) {
    this.searchService.GetFullFile(FileNo).subscribe((res) => {
      if (res) {
        //  console.log("9090res",res);
        this.FilePath = res;
        /// saveAs(res, row.ACC + '.pdf');
        this._TempFilePath = res;
        this.fileExt = res.substring(res.lastIndexOf("."), res.length);
      }
    });
  }

  // GetFullFile(FileNo:any) {

  //   const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/GetFullFile?ID='+localStorage.getItem('UserID')+'&&_fileName='+ FileNo +'&user_Token='+localStorage.getItem('User_Token');
  //   this._onlineExamService.getDataById(apiUrl).subscribe(res => {
  //     if (res) {

  //   //  console.log("9090res",res);
  //       this.FilePath = res;
  //        /// saveAs(res, row.ACC + '.pdf');
  //        this._TempFilePath = res;

  //     }
  //   });
  // }

  profileImg: any;
  documentDetails: any;
  GetDocumentDetails(row: any) {
    // const apiUrl="https://demo2993066.mockable.io/getAllData";

    this.searchService
      .GetDocumentDetails(row.AccNo)
      .subscribe((data: [any]) => {
        // this._IndexList = data;
        // this._FilteredList = data;
        this.documentDetails = data;
      });
  }

  showDocument(doc) {
    /// this.FilePath = doc.RelPath;
    //console.log("Row**",doc);
    this.searchService.GetTagFile(doc).subscribe((res) => {
      if (res) {
        //    console.log("res",res);
        this.FilePath = res;
        /// saveAs(res, row.ACC + '.pdf');
      }
    });
  }

  ngOnDestroy() {
    document.body.classList.remove("CS");
  }

  selectAllRows = false;
  selectAllRow(e) {
    console.log("E-", e);

    this.selectedRows = [];
    this.selectedRowsForMetadata = [];
    if (e.checked) {
      this.selectAllRows = true;
      this.formattedData.forEach((el, index) => {
        //  this.selectedRows.push(el.AccNo +"_" + el.DocID);
        if (index >= this.first && index < this.first + this.rows) {
          this.selectedRows.push(el.AccNo);
          this.selectedRowsForMetadata.push(el.AccNo);
          el.selected = true;
        }
      });
    } else {
      this.selectAllRows = false;
      this.selectedRows = [];
      this.formattedData
        .filter((el) => el.selected)
        .forEach((element) => {
          element.selected = false;
        });
    }
  }

  selectedRows = [];
  selectedRowsForMetadata = [];
  selectRow(e, row) {
    this.selectAllRows = false;
    e.originalEvent.stopPropagation();
    if (e.checked) {
      this.selectedRows.push(row.AccNo);
      this.selectedRowsForMetadata.push(row.AccNo);
    } else {
      this.selectAllRows = false;
      var index = this.selectedRows.indexOf(row.AccNo);
      this.selectedRows.splice(index, 1);
      var indexMetadata = this.selectedRowsForMetadata.indexOf(row.AccNo);
      this.selectedRowsForMetadata.splice(indexMetadata, 1);
    }
  }

  paginate(e) {
    this.first = e.first;
    this.rows = e.rows;
  }
  _HeaderList: any;
  GetHeaderNames() {
    this._HeaderList = "";
    for (let j = 0; j < this._ColNameList.length; j++) {
      this._HeaderList +=
        this._ColNameList[j].DisplayName +
        (j <= this._ColNameList.length - 2 ? "," : "");
      // headerArray.push(headers[j]);
    }
    this._HeaderList += "," + "FOLDER";
    this._HeaderList += "," + "SUBFOLDER";
    this._HeaderList += "," + "PAGECOUNT";
    this._HeaderList += "\n";
    let that = this;
    this._MDList.forEach((stat) => {
      // if ( that.selectedRows.indexOf(stat['Ref1']) > -1 ) {
      for (let j = 0; j < this._ColNameList.length; j++) {
        this._HeaderList +=
          (j == 0 ? stat["Ref" + (j + 1)] + "" : stat["Ref" + (j + 1)]) +
          (j <= this._ColNameList.length - 2 ? "," : "");
      }
      // }

      this._HeaderList += "," + stat.BranchName;
      this._HeaderList += "," + stat.SubfolderName;
      this._HeaderList += "," + stat.PageCount;
      this._HeaderList += "\n";
    });
  }

  downloadBulkFileBYCSV(_CSVData: any) {
    this.ContentSearchForm.patchValue({
      ACC: _CSVData,
    });

    // BulkDownload
    //   const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/SearchBulkFile?ID=' + localStorage.getItem('UserID') + '&_fileName= '+  _CSVData +' &user_Token='+ localStorage.getItem('User_Token');
    //  this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
    this.searchService
      .downloadBulkFileBYCSV(this.ContentSearchForm.value)
      .subscribe((res) => {
        if (res) {
          saveAs(res, "Bulk Files" + ".zip");
        }
        // console.log("Final FP-- res ", res);
      });
  }

  GetFilterData(tempID: any) {
    //   const apiUrl = this._global.baseAPIUrl + 'TaggingDetails/GetPendingData?UserID=' + localStorage.getItem('UserID') + '&user_Token='+ localStorage.getItem('User_Token');

    //    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/getSearchDataByFolderStructure?UserID=' + localStorage.getItem('UserID') + '&user_Token='+ localStorage.getItem('User_Token');
    // const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/getSearchDataByFilter?UserID='+localStorage.getItem('UserID')+'&user_Token='+localStorage.getItem('User_Token')+'&TemplateID='+this.ContentSearchForm.get('TemplateID').value+'&BranchID='+this.ContentSearchForm.get('BranchID').value+'&SearchParamterID='+this.ContentSearchForm.get('SearchByID').value+'&SearchValues='+this.ContentSearchForm.get('FileNo').value

    //this._onlineExamService.postData(this.ContentSearchForm.value,apiUrl)

    // const apiUrl="https://demo2993066.mockable.io/getAllData";
    //this._onlineExamService.getAllData(apiUrl).
    this.searchService
      .getSearchDataByFilter(this.ContentSearchForm.value)
      .subscribe((data: [any]) => {
        this._FileList = data;
        this._FilteredList = data;
        this.GetDisplayField(this.ContentSearchForm.get("TemplateID").value);

        // console.log("Loggg1111",data);
      });
  }

  // DownloadMetadata() {
  //   let _CSVData = "";
  //   for (let j = 0; j < this.selectedRowsForMetadata.length; j++) {
  //     _CSVData += this.selectedRowsForMetadata[j] + ',';
  //   }
  //   const apiUrl = this._global.baseAPIUrl + 'Status/GetMetaDataReportByFileNo?FileNo=' + _CSVData + '&user_Token=' + localStorage.getItem('User_Token')+'&UserID='+localStorage.getItem('UserID')
  //   //const apiUrl = this._global.baseAPIUrl + 'Status/GetMetaDataReportByFileNo?FileNo=' + _CSVData + '&user_Token=' + localStorage.getItem('User_Token')

  //   this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
  //     this._MDList = data;
  //     this.GetHeaderNames();
  //     let csvData = this._HeaderList;
  //     // alert(this._HeaderList);
  //     // console.log("Data",csvData)
  //     let blob = new Blob(['\ufeff' + csvData], {
  //         type: 'text/csv;charset=utf-8;'
  //     });
  //     let dwldLink = document.createElement("a");
  //     let url = URL.createObjectURL(blob);

  //     let isSafariBrowser =-1;
  //     // let isSafariBrowser = navigator.userAgent.indexOf( 'Safari') != -1 & amp; & amp;
  //     // navigator.userAgent.indexOf('Chrome') == -1;

  //     //if Safari open in new window to save file with random filename.
  //     if (isSafariBrowser) {
  //         dwldLink.setAttribute("target", "_blank");
  //     }
  //     dwldLink.setAttribute("href", url);
  //     dwldLink.setAttribute("download", 'Metadata dump' + ".csv");
  //     dwldLink.style.visibility = "hidden";
  //     document.body.appendChild(dwldLink);
  //     dwldLink.click();
  //     document.body.removeChild(dwldLink);
  //   });

  // }

  DownloadMetadata() {
    let _CSVData = "";
    for (let j = 0; j < this.selectedRowsForMetadata.length; j++) {
      _CSVData += this.selectedRowsForMetadata[j] + ",";
    }

    this.ContentSearchForm.patchValue({
      ACC: _CSVData,
      User_Token: localStorage.getItem("User_Token"),
      userID: localStorage.getItem("UserID"),
    });

    // this._onlineExamService.postData(this.ContentSearchForm.value, apiUrl)

    // const apiUrl = this._global.baseAPIUrl + 'Status/GetMetaDataReportByFileNo?FileNo=' + _CSVData + '&user_Token=' + localStorage.getItem('User_Token')+'&UserID='+localStorage.getItem('UserID')
    //const apiUrl = this._global.baseAPIUrl + 'Status/GetMetaDataReportByFileNo?FileNo=' + _CSVData + '&user_Token=' + localStorage.getItem('User_Token')
    this.searchService
      .GetMetaDataFileNo(this.ContentSearchForm.value)
      .subscribe((data: {}) => {
        this._MDList = data;
        this.GetHeaderNames();
        let csvData = this._HeaderList;
        // alert(this._HeaderList);
        // console.log("Data",csvData)
        let blob = new Blob(["\ufeff" + csvData], {
          type: "text/csv;charset=utf-8;",
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
        dwldLink.setAttribute("download", "Metadata" + ".csv");
        dwldLink.style.visibility = "hidden";
        document.body.appendChild(dwldLink);
        dwldLink.click();
        document.body.removeChild(dwldLink);
      });
  }

  ShareLink(template: TemplateRef<any>) {
    var that = this;
    ///console.log("Email", this.selectedRows);
    let _CSVData = "";
    for (let j = 0; j < this.selectedRows.length; j++) {
      _CSVData += this.selectedRows[j] + ",";
      // headerArray.push(headers[j]);
      // console.log("CSV Data", _CSVData);
    }
    this.ContentSearchForm.controls["ACC"].setValue(_CSVData);
    this.ContentSearchForm.controls["FileNo"].setValue(_CSVData);
    this.modalopen=true;
    this.ShareLinkFormPopup=true;
    // if (_CSVData != null) {

    // }

    //TODO
    // this.modalRef = this.modalService.show(template);
  }

  onSendEmailByShare() {
    this.searchService.SendEmailBulkFiles(this.ContentSearchForm.value).subscribe((data) => {
        this.toaster.show("success", "Success!", "Email send successfully");
        this.modalopen=false;
        this.ShareLinkFormPopup=false;
      });
  }
  SendBulkEmail(template: TemplateRef<any>) {
    var that = this;
    //console.log("Email", this.selectedRows);
    let _CSVData = "";
    for (let j = 0; j < this.selectedRows.length; j++) {
      _CSVData += this.selectedRows[j] + ",";
      // headerArray.push(headers[j]);
      // console.log("CSV Data", _CSVData);
    }
    this.ContentSearchForm.controls["ACC"].setValue(_CSVData);
    this.ContentSearchForm.controls["FileNo"].setValue(_CSVData);

    this.modalopen = true;
    this.EmailFormPopup = true;

    // if (_CSVData != null) {

    // }
    //TODO
    // 
  }

  onSendEmail() {
    if (this.selectedRows.length <= 10) {
      //  const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/SendBulkTagFileOnMail?ID='+localStorage.getItem('UserID')+'&DocID='+1+'&_fileName='+ this.ContentSearchForm.controls['FileNo'].value +'&user_Token='+localStorage.getItem('User_Token');

      this.searchService.SendEmail(this.ContentSearchForm.value).subscribe((data) => {
          this.toaster.show("success", "Success!", "Email sent successfully");
          //TODO
          this.modalopen=false;
          this.EmailFormPopup=false;
        });
      
    } else {
      this.ShowErrormessage("You can not send more than 10 files on mails.");
    }
  }

  ExporttoExcel() {
    this.Getmetadata();
    let csvData = this._HeaderList;
    let blob = new Blob(["\ufeff" + csvData], {
      type: "text/csv;charset=utf-8;",
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
    dwldLink.setAttribute("download", "Metadata" + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  Getmetadata() {
    this._HeaderList = "";
    //console.log(this._ColNameList);

    for (let j = 0; j < this._ColNameList.length; j++) {
      this._HeaderList +=
        this._ColNameList[j].DisplayName +
        (j <= this._ColNameList.length - 2 ? "," : "");
      // headerArray.push(headers[j]);
    }
    // for (let j = 1; j < this.tableHeader.length; j++) {

    //   //  this._HeaderList += this.tableHeader[j].DisplayName +((j <= this.metadataList.length-2)?',':'') ;
    //   this._HeaderList += ','+ this.tableHeader[j].header ;
    //   // headerArray.push(headers[j]);
    // }

    // this._HeaderList += ','+ 'REGION'
    this._HeaderList += "," + "FOLDER";
    this._HeaderList += "," + "SUBFOLDER";
    this._HeaderList += "," + "PAGECOUNT";

    this._HeaderList += "\n";
    let that = this;
    //console.log(this._ColNameList.length);
    //console.log(this._FilteredList);
    this._FilteredList.forEach((stat) => {
      // if ( that.selectedRows.indexOf(stat['Ref1']) > -1 ) {
      for (let j = 0; j < this._ColNameList.length; j++) {
        this._HeaderList +=
          (j == 0 ? stat["Ref" + (j + 1)] + "" : stat["Ref" + (j + 1)]) +
          (j <= this._ColNameList.length - 2 ? "," : "");
      }
      // this._HeaderList +=',' + stat.DepartmentName;
      this._HeaderList += "," + stat.BranchName;
      this._HeaderList += "," + stat.SubfolderName;
      this._HeaderList += "," + stat.DocCount;

      // }
      this._HeaderList += "\n";
    });

    // this._FilteredList.forEach(stat => {
    //   // if ( that.selectedRows.indexOf(stat['Ref1']) > -1 ) {
    //     for (let j = this._ColNameList.length; j < this._ColNameList.length + 4; j++) {

    //     //  this._HeaderList += (j==0?(stat['Ref'+(j+1)]+''):stat['Ref'+(j+1)]) + ((j <= this._ColNameList.length-2)?',':'') ;

    //     }
    //   // }
    //   this._HeaderList += '\n'
    // });
  }

  DownloadBulkFiles() {
    if (this.selectedRows.length <= 25) {
      let _CSVData = "";
      for (let j = 0; j < this.selectedRows.length; j++) {
        _CSVData += this.selectedRows[j] + ",";
        // headerArray.push(headers[j]);
        // console.log("CSV Data", _CSVData);
      }
      // console.log("CSV Data", _CSVData);
      this.downloadBulkFileBYCSV(_CSVData);
    } else {
      this.ShowErrormessage(
        "You can not select more than 25 files to download"
      );
    }
  }

  ShowErrormessage(data: any) {
    this.toaster.show("error", "Validation!", data);
  }
  get cf(){
    return this.ContentSearchForm.controls;
  }
}
