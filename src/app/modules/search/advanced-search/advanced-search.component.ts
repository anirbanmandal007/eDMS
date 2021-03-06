import { Component, OnInit, TemplateRef,EventEmitter,Output } from "@angular/core";
//import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators,FormArray,FormControl } from "@angular/forms";
import { Router, ActivatedRoute } from '@angular/router';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { ToasterService } from "app/shared/toaster/toaster.service";
import { SearchService } from "../search.service";
import { ConfirmationDialogComponent, ConfirmDialogModel } from "app/shared/confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
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
  selector: "app-advanced-search",
  templateUrl: "advanced-search.component.html",
  styleUrls: ["advanced-search.component.scss"]
})
export class AdvancedSearchComponent implements OnInit {
  entries: number = 10;
  selected: any[] = [];
  temp = [];
  activeRow: any;
  SelectionType = SelectionType;
  _FilteredList :any; 
  _TemplateList :any;  
  TemplateList:any;
  ContentSearchForm: FormGroup;
  submitted = false;
  Reset = false;     
  sMsg: string = '';  
  //UploadDocForm: FormGroup;  
  _SingleDepartment:any
  _ColNameList:any;
  _DepartmentList: any;
  _BranchList: any;
  BranchList:any;
  _FileNo: any = "";
  _PageNo: number = 1;
  FilePath:any="../assets/1.pdf";  
  _TempFilePath:any;
  _isDownload: any = localStorage.getItem('Download');
  _isDelete: any = localStorage.getItem('Delete');
  _TotalPages: any = 0;
  _SearchByList: any;
  userID = 1;
  TempField:any =localStorage.getItem('FileNo');
  _isEmail: any = true;
  _ShareLink: any = true;
  _isEdit:any=true;
  _DocTypeList: any;
  _FileList: any;
  _DocName: any;
  myFiles: string[] = [];
  _DocID: any;
  _MDList:any;
  _IndexList:any;
  _TempD:any;
  EntityList:any;
  _isDocView:any=true;
  first = 0;
  rows = 10;
  _RootList:any;
  today = new Date();
  fileExt;
  _FileDetails:string [][] = [];
  dropdownList = [];
  selectedItems = [];
  //pop up modal
  modalopen: boolean = false;
  EmailFormPopup: boolean =  false;
  ShareLinkFormPopup: boolean =  false;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  get filters() { return this.ContentSearchForm.get('filters') as FormArray; }

  @Output() public onUploadFinished = new EventEmitter();
  
 
      
    constructor(
      private formBuilder: FormBuilder,
      private http: HttpClient,
      private httpService: HttpClient,
      private route: ActivatedRoute,
      private router: Router,
      private toaster: ToasterService,
      private searchService: SearchService,
      private dialog: MatDialog,
      private shareService: SharedService,
      private _activatedRoute: ActivatedRoute
    ) { }
  
    ngOnInit() {
      document.body.classList.add('CS');
      this.ContentSearchForm = this.formBuilder.group({
      FileNo: ['', Validators.required],
      TemplateID: [0, Validators.required],                
      _ColNameList: this._ColNameList,
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      Viewer: [''],
      currentPage: [0],      
      PageCount: [0],
      //tickets: new FormArray([]),
      SerchBy: [''],
      DocID: [''],
      SearchByID: [],
      userID: localStorage.getItem('UserID') ,
      ACC: [''],
      MFileNo: [''],
      DocuemntType: [''],
      AccNo: [''],     
      ToEmailID:['', [Validators.required, Validators.email]],
      ValidDate:[''],
      IsAttachment:[''],
      BranchID:['0'],
      DeptID:['0'],
      SubfolderID:[0], 
      RootID:[0],
      TempIDList:[''],
      filters: this.formBuilder.array([]),
  
      });
      this.getTemplate();
      this._PageNo = 1;


    //  this.GetEntityList();
      //this.getSearchResult(0);
   this.getSearchParameterList(0);
      //this.getDoctypeListByTempID(1);
    

this.geBranchList();
//this.getDepartmnet();

// this.getRootList();
this.getRights(JSON.parse(localStorage.getItem("userData"))?.id);
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

    onAddFilterRow() {
      let fg = this.formBuilder.group({
        Condition: ['0'],
        SearchByID: ['0'],
        Operation: ['0'],
        FileNo: [''],
        FieldType: [''],
        DateRange: [''],
        DateRangePicker: ['']
      })
      this.filters.push(fg)
    }
    onRemoveRow(indx) {
      this.filters.removeAt(indx)
    }
    onSearchBySelected(i){
      // console.log('SearchByID in form',this.SearchForm.get('SearchByID'));
      let selectedVal = this.filters.at(i).value.SearchByID

    //  alert(this.filters.at(i).value.SearchByID);
      // console.log('selectedVal',selectedVal);
      let selectedDataType = this._SearchByList.find(s=>s.SID == selectedVal)
      //this.SearchForm.get('FieldType').setValue(selectedDataType.FieldType)
      // console.log('Filter Array',this.filters.at(i), selectedDataType);
    
      this.filters.at(i).patchValue({"FieldType": selectedDataType.FieldType})
      // console.log("FieldType",selectedDataType.FieldType, this.filters.at(i));

       
    }


    onDateOperationChange(i) {
      this.filters.at(i).patchValue({"DateRange": this.filters.at(i).value.Operation});
    }

    
    onFilterSubmited() {

  
       // alert(this.ContentSearchForm.get('TemplateID').value);
        // var VarTempIDList =this.ContentSearchForm.get('TemplateID').value;
        //var TempIDList =[];
        let selectedFileNames = '';
        // VarTempIDList.forEach(el => {
        // selectedFileNames += el['TemplateID'] + ',';
        // })

        this.ContentSearchForm.patchValue({
        TempIDList: selectedFileNames,
   
});
 

      // const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/OnDynamicFilterData';
   
      this.searchService.OnDynamicFilterData(this.ContentSearchForm.value)
        .subscribe(data => {

     // console.log("FilterData",data);

      this._FileList = data;
      this._FilteredList = data;
      this.GetDisplayField(this.ContentSearchForm.get('TemplateID').value);
  
        }); 

    }
    
    // GetFilterSearch(tid:any)
    // {
    //   this.GetFilterData(this.SearchForm.get('TemplateID').value);


    // }
    // geBranchListByUserID(userid: number) {
    //   //     alert(this.BranchMappingForm.value.UserID);
    //   this.geBranchList(userid);
    // }
  
    geBranchList() {
      //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
      this.searchService.getBranchList().subscribe((data: any) => {
        this.BranchList = data;
      //  this._FilteredList = data;
        //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
      });
    }

  //   getDepartmnet(RootID: any) {

  //     const apiUrl = this._global.baseAPIUrl + "Department/GetDepartmentByUserID?UserID="+localStorage.getItem('UserID')+"&RoleID="+RootID+"&user_Token="+localStorage.getItem('User_Token');
 
  //  //   const apiUrl=this._global.baseAPIUrl+'Department/GetDepartmentByUserID?user_Token='+ localStorage.getItem('User_Token');
  //     this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
  //     this._DepartmentList = data;
  //    // this._DepartmentLists=data;
  // //    console.log("data : -", data);
  //     this.ContentSearchForm.controls['DeptID'].setValue(0);
  //     this.ContentSearchForm.controls['BranchID'].setValue(0);
  //    // this.RegionMappingForm.controls['DeptIDS'].setValue(0);
      
  
  //     //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
  //     });
  
  //     }
  

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
      // this.getEntity(userid);
    }


  //   getEntity(userid: number) {
  //     const apiUrl =this._global.baseAPIUrl +"SubFolderMapping/GetSubFolderByBranch?UserID="+localStorage.getItem('UserID')+"&CreatedBy="+localStorage.getItem('UserID')+"&user_Token="+localStorage.getItem('User_Token')+"&BranchID="+this.ContentSearchForm.get("BranchID").value;
  
  //  //   const apiUrl =this._global.baseAPIUrl +"SubFolderMapping/GetDetails?ID="+userid+"&user_Token="+this.EntityMappingForm.get("User_Token").value;;
  //     //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
  //     this._onlineExamService.getProducts(apiUrl).subscribe((res) => {
  //       this.EntityList = res;
  //       this.ContentSearchForm.controls['SubfolderID'].setValue(0);
  //       //  this.checkbox_list = [];
  //       //this.checkbox_list = res;
  //       //this.checklistArray.clear()
  //       // this.checkbox_list.forEach(item => {
  //       //   let fg = this.formBuilder.group({
  //       //     id: [item.id],
  //       //     SubfolderName: [item.SubfolderName],
  //       //     ischecked: [item.ischecked]
  //       //     })
  //       //     this.checklistArray.push(fg)
  //       // });
  //     //  console.log('Branch Mapping -> ',res);
        
  //       // this.itemRows = Array.from(Array(Math.ceil(this.checkbox_list.length/2)).keys())
  
  //       //this.productsArray = res;
  //       //  this.checkbox_list= res;
  //       //this.checklist =res;
  //     });
  //   }

   
    entriesChange($event) {
      this.entries = $event.target.value;
    }
    filterTable($event) {
      console.log($event.target.value);
  
      let val = $event.target.value;
      this._FilteredList = this._FileList.filter(function (d) {
        console.log(d);
        for (var key in d) {
          if (key == "AccNo" || key == "BranchName" || key == "DocType" ) {
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

      getSearchParameterList(TID:any) {

        //alert(TID);
      
        //  const apiUrl=this._global.baseAPIUrl+'SearchFileStatus/getSearchParameterList?user_Token=123123'
        this.searchService.getSearchParameterList(TID).subscribe((data: {}) => {
          this._SearchByList = data;
          
        this.ContentSearchForm.controls['SearchByID'].setValue(0);
        
       // alert('Hi');
        console.log(data);

        //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
        });


      }

//       getDoctypeListByTempID(TID:any) {
    
//         //const apiUrl=this._global.baseAPIUrl+'BranchMapping/GetList?user_Token=123123'
//         const apiUrl = this._global.baseAPIUrl + 'DocTypeMapping/getDoctypeListByTempID?ID=' + localStorage.getItem('UserID') + '&TemplateID='+ TID +'&user_Token='+this.ContentSearchForm.get('User_Token').value
// //      console.log("apiUrl",apiUrl);      
//         this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
//           this._DocTypeList = data;
//          this.ContentSearchForm.controls['DocID'].setValue(0);
//         //  console.log("_DeptList",this._DeptList);
//           //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
//         });
//       }


     
      // geTemplateNameListByTempID(TID: number) {      
        
      //   this.getSearchParameterList(TID);
      // //  this.getDoctypeListByTempID(TID);
      //   this.getSearchResult(TID);
      
      // }

      GetFilterSearch(tid:any)
      {
        this.GetFilterData(1);
      }
    
  BindDropDown()
  {

    // this.dropdownList = [
    //   { item_id: 1, item_text: 'Mumbai' },
    //   { item_id: 2, item_text: 'Bangaluru' },
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' },
    //   { item_id: 5, item_text: 'New Delhi' }
    // ];
    // this.selectedItems = [
    //   { item_id: 3, item_text: 'Pune' },
    //   { item_id: 4, item_text: 'Navsari' }
    // ];

  }

      getTemplate() {

        // const apiUrl = this._global.baseAPIUrl + 'TemplateMapping/GetTemplateMappingListByUserID?UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token');
    
        // const apiUrl = this._global.baseAPIUrl + 'Template/GetTemplate?user_Token=' + this.FileStorageForm.get('User_Token').value
        this.searchService.GetTemplateMappingListByUserID().subscribe((data: {}) => {
          this.TemplateList = data;
        //  this.ContentSearchForm.controls['TemplateID'].setValue(1);
          
          this.ContentSearchForm.controls['TemplateID'].setValue(data[0] ? data[0].TemplateID : 1);
          //this.AddEditBranchMappingForm.controls['UserIDM'].setValue(0);
          //this.itemRows = Array.from(Array(Math.ceil(this.adresseList.length/2)).keys())
        // console.log("TempID",data[0].TemplateID);
        this._TempD = data[0] ? data[0].TemplateID : 1;
         this.getSearchResult(data[0] ? data[0].TemplateID : 1);
          
        //  this.getSearchParameterList( this._TempD);
         this.dropdownList=  JSON.parse(JSON.stringify(data));
         this.BindDropDown();

        });
      }
    
      getSearchResult(tempID:any) {

     //   const apiUrl = this._global.baseAPIUrl + 'TaggingDetails/GetPendingData?UserID=' + localStorage.getItem('UserID') + '&user_Token='+ localStorage.getItem('User_Token');
     
      //    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/getSearchDataByFolderStructure?UserID=' + localStorage.getItem('UserID') + '&user_Token='+ localStorage.getItem('User_Token');
      // const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/getSearchDataByFolderStructure?UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token') + '&TemplateID=' + tempID  
     
      // const apiUrl="https://demo2993066.mockable.io/getAllData";
    this.searchService.getSearchDataByFolderStructure(tempID).subscribe((data: [any]) => {
          this._FileList = data;
          this._FilteredList = data;
          this.GetDisplayField(tempID);

         // console.log("Loggg",data);
        });
      }
      
    GetDisplayField(TID:number) {
      // const apiUrl=this._global.baseAPIUrl+'DataUpload/GetFieldsName?ID='+TID+'&user_Token='+ localStorage.getItem('User_Token') 
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
        { field: 'srNo', header: "SR No", index: 1 },
        // { field: 'accId', header: 'Acc ID', index: 2 },
        { field: 'branch', header: 'Branch', index: 3 },
      //  { field: 'department', header: 'Department', index: 4 },
        { field: 'docType', header: 'Doc Type', index: 5 },
        { field: 'pageCount', header: 'Page Count', index: 6 }
      ];
      headerList.forEach((el, index) => {
        tableHeader.push({
          field: 'metadata-' + parseInt(index+1), header: el.DisplayName, index: parseInt(7+index)
        })
      })
      tableData.forEach((el, index) => {
        formattedData.push({
          'srNo': parseInt(index + 1),
          'accId': el.Ref1,
          'branch': el.BranchName,
        //  'department': el.DepartmentName,
          'docType': el.DocType,
          'pageCount': el.DocCount,
          'AccNo': el.AccNo,
          'TemplateID': el.TemplateID,
          'RelPath': el.RelPath,
          'FilePath': el.FilePath,
          'ACC': el.ACC,
          'DocID': el.DocID,
          'profileImg': el.PhotoPath
        });
        headerList.forEach((el1, i) => {
          formattedData[index]['metadata-' + parseInt(i + 1)] = el['Ref'+ parseInt(i+1)]
        });
      });
      this.headerList = tableHeader;
      this.immutableFormattedData = JSON.parse(JSON.stringify(formattedData));
      this.formattedData = formattedData;
      this.loading=false;
    }

    searchTable($event) {
      // console.log($event.target.value);
  
      let val = $event.target.value;
      if(val == '') {
        this.formattedData = this.immutableFormattedData;
      } else {
        let filteredArr = [];
        const strArr = val.split(',');
        this.formattedData = this.immutableFormattedData.filter(function (d) {
          for (var key in d) {
            strArr.forEach(el => {
              if (d[key] && el!== '' && (d[key]+ '').toLowerCase().indexOf(el.toLowerCase()) !== -1) {
                if (filteredArr.filter(el => el.srNo === d.srNo).length === 0) {
                  filteredArr.push(d);
                }
              }
            });
          }
        });
        this.formattedData = filteredArr;
      }
    }

    DownloadFileAll(_FileNo: any,_File:any) {

      const fileExt = _File.filePath.substring(_File.filePath.lastIndexOf('.'), _File.filePath.length);
      // const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/DownloadFileFromDB?ID=' + localStorage.getItem('UserID') + '&FileNo= ' + _FileNo + ' &user_Token=' + localStorage.getItem('User_Token');
      this.searchService.DownloadFileFromDB(_FileNo).subscribe(res => {
        if (res) {
  
          //      var __FilePath = _TempFilePath ;    
          // console.log("Final FP-- res ", _File);
         // saveAs(res,_FileNo +".pdf");
         saveAs(res,_FileNo + fileExt);
  
        }
      });
      
    }

    
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

        // const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/DownloadTagFile?ID='+localStorage.getItem('UserID')+'&DocID='+row.DocID+'&_fileName='+row.AccNo+'&user_Token='+localStorage.getItem('User_Token');
        this.searchService.DownloadTagFile(row).subscribe(res => {
          if (res) {
          
            saveAs(res,row.AccNo +".pdf");

          }
        });
    
      }
        
      DeleteFile(Row: any) {
        const message = `Are you sure you want delete this file?`;
        const dialogData = new ConfirmDialogModel("Confirm Deletion", message, 'Delete', 'Cancel');

        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          maxWidth: "0",
          data: dialogData
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          if(dialogResult) {
            this.ContentSearchForm.patchValue({
              ACC: Row.AccNo,
              User_Token: localStorage.getItem('User_Token'),
              userID: localStorage.getItem('UserID'),
              DocID: Row.DocID
            });

            const that = this;
            // const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/Delete';
            this.searchService.DeleteFile(this.ContentSearchForm.value)     
            .subscribe( data => {
                this.toaster.show('success', 'Success!', 'Doc Type has been deleted!');
                // swal.fire({
                //   title: "Deleted!",
                //   text: "Doc Type has been deleted.",
                //   type: "success",
                //   buttonsStyling: false,
                //   confirmButtonClass: "btn btn-primary",
                // });
                that.getSearchResult(that.ContentSearchForm.get('TemplateID').value);
              });
          }
        });
      }
      // Model Popup For Docuemnt Inserstion 
    
      showModal(Row: any): void {
    
        if (Row != null) {
          this._FileNo = Row.AccNo;
          this._DocID = Row.DocID;
          this._DocName = Row.ACC
          this.ContentSearchForm.controls['MFileNo'].setValue(this._FileNo);
          this.ContentSearchForm.controls['DocuemntType'].setValue(this._DocName);
        }
        // 
       $("#myModal").modal('show');
    
    
      }
      sendModal(): void {
        //do something here
        this.hideModal();
      }
      hideModal(): void {
        document.getElementById('close-modal').click();
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
        this.myFiles=[];
        for (var i = 0; i < e.target.files.length; i++) {
          this.myFiles.push(e.target.files[i]);
        //  console.log("File",this.myFiles);

        }
        let selectedFileNames = '';
        this.myFiles.forEach(el => {
          selectedFileNames += el['name'] + '<br />';
        })
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
    
        frmData.append('DocID', this._DocID);
        frmData.append('AccNo', this._FileNo);
        frmData.append('ACC', this._DocName);
        frmData.append('UserID', localStorage.getItem('UserID'));
    
        
        // const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/Upload';
        this.searchService.uploadFiles(frmData).subscribe(
          data => {
            // SHOW A MESSAGE RECEIVED FROM THE WEB API.
            this.toaster.show('success', 'Success!', data);
            // this.toastr.show(
            //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Success!</span> <span data-notify="message"> '+ data +' </span></div>',
            //   "",
            //   {
            //     timeOut: 3000,
            //     closeButton: true,
            //     enableHtml: true,
            //     tapToDismiss: false,
            //     titleClass: "alert-title",
            //     positionClass: "toast-top-center",
            //     toastClass:
            //       "ngx-toastr alert alert-dismissible alert-success alert-notify"
            //   }
            // );

            that.getSearchResult(that.ContentSearchForm.get('TemplateID').value);
          },
    
        );
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

      OnLoad()
      {
        this.getSearchResult(this._TempD);
      }
    
      EditRowData(Row: any) {
        
        localStorage.setItem('FileNo', Row.AccNo);
        localStorage.setItem('TemplateID', Row.TemplateID);
        
        //this.localStorage.setItem('_TempID') =_TempID;
        this.router.navigate(['/process/EditIndexing']);
      }


      // MetaData(template: TemplateRef<any>, row: any)
      // {
      //   //FileNo: localStorage.getItem('FileNo'),
      // //  TemplateID:localStorage.getItem('TemplateID')  
      // let  __FileNo =row.AccNo;
      // let  __TempID = row.TemplateID;

      // const apiUrl=this._global.baseAPIUrl+'DataEntry/GetNextFile?id='+__TempID+'&FileNo='+__FileNo+'&user_Token='+ localStorage.getItem('User_Token');
  
      // //const apiUrl=this._global.baseAPIUrl+'DataEntry/GetNextFile?id'+  + '' FileNo='+ __FileNo + '&user_Token=123123'
      // this._onlineExamService.getAllData(apiUrl).subscribe((data: {}) => {
  
      //    this._IndexList = data;           
      //    //console.log("Index",data);
      // });
      // // this.modalRef = this.modalService.show(template);
      // }



    hidepopup()
    {
    // this.modalService.hide;
    //TODO
      // this.modalRef.hide();
      //this.modalRef.hide
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

    ViewDocument(template: TemplateRef<any>, row: any, indexTemplate: TemplateRef<any>) {
      // this.MetaData(indexTemplate, row);
      
    //  this.FilePath = row.RelPath;
      //this._TempFilePath =row.RelPath;
      //TODO
      // this.modalRef = this.modalService.show(template);
      // $(".modal-dialog").css('max-width', '1330px');
      // this.GetDocumentDetails(row);

      // this.GetFullFile(row.AccNo);

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

    // GetFullFile(FileNo:any) {

    //   const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/GetFullFile?ID='+localStorage.getItem('UserID')+'&&_fileName='+ FileNo +'&user_Token='+localStorage.getItem('User_Token');
    //   this._onlineExamService.getDataById(apiUrl).subscribe(res => {
    //     if (res) {
  
    //   //  console.log("9090res",res);
    //       this.FilePath = res;
    //        /// saveAs(res, row.ACC + '.pdf');
    //        this._TempFilePath = res;
    //        this.fileExt = res.substring(res.lastIndexOf('.'), res.length);
    //     }
    //   });
    // }

    profileImg: any;
    documentDetails: any;
    // GetDocumentDetails(row: any) {      
    
    //   const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/GetDocumentDetails?FileNo=' + row.AccNo + '&UserID=' + localStorage.getItem('UserID') + '&user_Token=' + localStorage.getItem('User_Token')

    //   // const apiUrl="https://demo2993066.mockable.io/getAllData";

    //   this._onlineExamService.getAllData(apiUrl).subscribe((data: [any]) => {

    //     // this._IndexList = data;
    //     // this._FilteredList = data;
    //     this.documentDetails = data;
    //   });
    // }

    // showDocument(doc) {

    //  /// this.FilePath = doc.RelPath;
    //   //console.log("Row**",doc);
    //   const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/GetTagFile?ID='+localStorage.getItem('UserID')+'&DocID='+doc.DocID+'&_fileName='+doc.AccNo+'&user_Token='+localStorage.getItem('User_Token');
    //   this._onlineExamService.getDataById(apiUrl).subscribe(res => {
    //     if (res) {
  
    //   //    console.log("res",res);
    //       this.FilePath = res;
    //        /// saveAs(res, row.ACC + '.pdf');
  
    //     }
    //   });
    // }

    ngOnDestroy() {
      document.body.classList.remove('CS');
    }

    selectAllRows = false;
    selectAllRow(e) {
        console.log("E-",e);

      this.selectedRows = [];
      this.selectedRowsForMetadata = [];
      if (e.checked) {
        this.selectAllRows = true;
        this.formattedData.forEach((el, index) => {
          //  this.selectedRows.push(el.AccNo +"_" + el.DocID);
          if(index >= this.first && index < this.first + this.rows) {
            this.selectedRows.push(el.AccNo);
            this.selectedRowsForMetadata.push(el.AccNo);
            el.selected = true;
          }
        })
      } else {
        this.selectAllRows = false;
        this.selectedRows = [];
        this.formattedData.filter(el => el.selected).forEach(element => {
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
  GetHeaderNames()
{
  this._HeaderList="";
  for (let j = 0; j < this._ColNameList.length; j++) {  
       
      this._HeaderList += this._ColNameList[j].DisplayName +((j <= this._ColNameList.length-2)?',':'') ;
    // headerArray.push(headers[j]);  
  }
  this._HeaderList += ','+ 'FOLDER' 
  this._HeaderList += ','+ 'SUBFOLDER' 
  this._HeaderList += ','+ 'PAGECOUNT' 
  this._HeaderList += '\n';
  let that = this;
  this._MDList.forEach(stat => {
    // if ( that.selectedRows.indexOf(stat['Ref1']) > -1 ) {
      for (let j = 0; j < this._ColNameList.length; j++) {
        this._HeaderList += (j==0?(stat['Ref'+(j+1)]+''):stat['Ref'+(j+1)]) + ((j <= this._ColNameList.length-2)?',':'') ;
      }
    // }

    this._HeaderList +=',' +stat.BranchName ;
   this._HeaderList +=',' +stat.SubfolderName;    
      this._HeaderList +=',' +stat.PageCount; 
    this._HeaderList += '\n'
  });
  

}

downloadBulkFileBYCSV(_CSVData:any) {
  this.ContentSearchForm.patchValue({
    ACC: _CSVData
  });

 // BulkDownload  
  // const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/DLoadBulkFiles';   
//   const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/SearchBulkFile?ID=' + localStorage.getItem('UserID') + '&_fileName= '+  _CSVData +' &user_Token='+ localStorage.getItem('User_Token');
//  this._onlineExamService.downloadDoc(apiUrl).subscribe(res => {
  this.searchService.downloadBulkFileBYCSV(this.ContentSearchForm.value).subscribe( res => {
    if (res) {      
    saveAs(res, "Bulk Files" + '.zip');         
    }
    // console.log("Final FP-- res ", res);  
  });

}

GetFilterData(tempID:any) {

  //   const apiUrl = this._global.baseAPIUrl + 'TaggingDetails/GetPendingData?UserID=' + localStorage.getItem('UserID') + '&user_Token='+ localStorage.getItem('User_Token');
  
   //    const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/getSearchDataByFolderStructure?UserID=' + localStorage.getItem('UserID') + '&user_Token='+ localStorage.getItem('User_Token');
  // const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/getSearchDataByFilter?UserID='+localStorage.getItem('UserID')+'&user_Token='+localStorage.getItem('User_Token')+'&TemplateID='+this.ContentSearchForm.get('TemplateID').value+'&BranchID='+this.ContentSearchForm.get('BranchID').value+'&SearchParamterID='+this.ContentSearchForm.get('SearchByID').value+'&SearchValues='+this.ContentSearchForm.get('FileNo').value  
  

  //  const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/getSearchDataByFilter';
  //this._onlineExamService.postData(this.ContentSearchForm.value,apiUrl)     

   // const apiUrl="https://demo2993066.mockable.io/getAllData";
 //this._onlineExamService.getAllData(apiUrl).
 this.searchService.getSearchDataByFilter(this.ContentSearchForm.get('TemplateID').value,this.ContentSearchForm.get('BranchID').value,this.ContentSearchForm.get('SearchByID').value,this.ContentSearchForm.get('FileNo').value). 
 subscribe((data: [any]) => {
       this._FileList = data;
       this._FilteredList = data;
       this.GetDisplayField(this.ContentSearchForm.get('TemplateID').value);

      // console.log("Loggg1111",data);
     });
   }

  


  DownloadMetadata() {
    let _CSVData = "";
    for (let j = 0; j < this.selectedRowsForMetadata.length; j++) {          
      _CSVData += this.selectedRowsForMetadata[j] + ',';
    }


    this.ContentSearchForm.patchValue({
      ACC: _CSVData
    });

    // const apiUrl = this._global.baseAPIUrl + 'Status/GetMetaDataFileNo';
       
   // this._onlineExamService.postData(this.ContentSearchForm.value, apiUrl)

   // const apiUrl = this._global.baseAPIUrl + 'Status/GetMetaDataReportByFileNo?FileNo=' + _CSVData + '&user_Token=' + localStorage.getItem('User_Token')+'&UserID='+localStorage.getItem('UserID')
    //const apiUrl = this._global.baseAPIUrl + 'Status/GetMetaDataReportByFileNo?FileNo=' + _CSVData + '&user_Token=' + localStorage.getItem('User_Token')
    this.searchService.GetMetaDataFileNo(this.ContentSearchForm.value).subscribe((data: {}) => {
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

  ShareLink(template: TemplateRef<any>)
  {
    var that = this;
  ///console.log("Email", this.selectedRows);
    let _CSVData= "";
    for (let j = 0; j < this.selectedRows.length; j++) {          
      _CSVData += this.selectedRows[j] + ',';
      // headerArray.push(headers[j]);  
     // console.log("CSV Data", _CSVData);
    }
    this.ContentSearchForm.controls['ACC'].setValue(_CSVData);
    this.ContentSearchForm.controls['FileNo'].setValue(_CSVData);
  
    // if (_CSVData != null) {
     
    // }
  //TODO
    this.modalopen=true;
    this.ShareLinkFormPopup=true;
  }

  onSendEmailByShare() {

    // const apiUrl = this._global.baseAPIUrl + 'Mail/SendEmailBulkFiles';
   
    this.searchService.SendEmailBulkFiles(this.ContentSearchForm.value)
      .subscribe(data => {
        this.toaster.show('success', 'Success!', 'Email sent successfully!');
        this.modalopen=false;
       this.ShareLinkFormPopup=false;

      });
      //TODO 
      // this.modalRef.hide();
 
     
  }
  SendBulkEmail(template: TemplateRef<any>)
  {
    var that = this;
  //console.log("Email", this.selectedRows);
    let _CSVData= "";
    for (let j = 0; j < this.selectedRows.length; j++) {          
      _CSVData += this.selectedRows[j] + ',';
      // headerArray.push(headers[j]);  
     // console.log("CSV Data", _CSVData);
    }
    this.ContentSearchForm.controls['ACC'].setValue(_CSVData);
    this.ContentSearchForm.controls['FileNo'].setValue(_CSVData);
  
    // if (_CSVData != null) {
     
    // }
    //TODO
    this.modalopen=true;
    this.EmailFormPopup=true;

  }

  onSendEmail() {

    if (this.selectedRows.length <=10)
    {
  // const apiUrl = this._global.baseAPIUrl + 'Mail/SendEmail';
  //  const apiUrl = this._global.baseAPIUrl + 'SearchFileStatus/SendBulkTagFileOnMail?ID='+localStorage.getItem('UserID')+'&DocID='+1+'&_fileName='+ this.ContentSearchForm.controls['FileNo'].value +'&user_Token='+localStorage.getItem('User_Token');
    
    this.searchService.SendEmail(this.ContentSearchForm.value)
      .subscribe(data => {
        this.toaster.show('success', 'Success!', 'Email sent successfully!');
        this.modalopen=false;
        this.EmailFormPopup=false;
      }); 
      //TODO
      // this.modalRef.hide();
     // this.getSearchResult();   

    }
    else
    {
      this.ShowErrormessage("You can not send more than 10 files on mails.");
    }
  }
  closeEmailPopUp() {
    this.modalopen=false;
    this.EmailFormPopup=false;
  }
  closeShareLinkPopUp(){
    this.modalopen=false;
    this.ShareLinkFormPopup=false;
  }
  ExporttoExcel()
  {

    this.Getmetadata();
    let csvData = this._HeaderList; 
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

  }

  Getmetadata()
{
  this._HeaderList="";
//console.log(this._ColNameList);

  for (let j = 0; j < this._ColNameList.length; j++) {  
       
      this._HeaderList += this._ColNameList[j].DisplayName +((j <= this._ColNameList.length-2)?',':'') ;
    // headerArray.push(headers[j]);  
  }
  // for (let j = 1; j < this.tableHeader.length; j++) {  
       
  //   //  this._HeaderList += this.tableHeader[j].DisplayName +((j <= this.metadataList.length-2)?',':'') ;
  //   this._HeaderList += ','+ this.tableHeader[j].header ;
  //   // headerArray.push(headers[j]);  
  // }

 // this._HeaderList += ','+ 'REGION' 
  this._HeaderList += ','+ 'FOLDER' 
  this._HeaderList += ','+ 'SUBFOLDER' 
  this._HeaderList += ','+ 'PAGECOUNT' 

  this._HeaderList += '\n';
  let that = this;
  //console.log(this._ColNameList.length);
  //console.log(this._FilteredList);
  this._FilteredList.forEach(stat => {
    // if ( that.selectedRows.indexOf(stat['Ref1']) > -1 ) {
      for (let j = 0; j < this._ColNameList.length; j++) {
        this._HeaderList += (j==0?(stat['Ref'+(j+1)]+''):stat['Ref'+(j+1)]) + ((j <= this._ColNameList.length-2)?',':'') ;
      }
     // this._HeaderList +=',' + stat.DepartmentName;
      this._HeaderList +=',' +stat.BranchName ;
      this._HeaderList +=',' +stat.SubfolderName;    
      this._HeaderList +=',' +stat.DocCount; 

    // }
    this._HeaderList += '\n'
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

  if (this.selectedRows.length <=25)
  {
  
  let _CSVData= "";
  for (let j = 0; j < this.selectedRows.length; j++) {          
    _CSVData += this.selectedRows[j] + ',';
    // headerArray.push(headers[j]);  
   // console.log("CSV Data", _CSVData);
  }
 // console.log("CSV Data", _CSVData);
  this.downloadBulkFileBYCSV(_CSVData) ;
}
else {

  this.ShowErrormessage("You can not select more than 25 files to download");
}

}

ShowErrormessage(data:any)
{
  this.toaster.show('error', 'Error!', data);
  // this.toastr.show(
  //   '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Validation ! </span> <span data-notify="message"> '+ data +' </span></div>',
  //   "",
  //   {
  //     timeOut: 3000,
  //     closeButton: true,
  //     enableHtml: true,
  //     tapToDismiss: false,
  //     titleClass: "alert-title",
  //     positionClass: "toast-top-center",
  //     toastClass:
  //       "ngx-toastr alert alert-dismissible alert-danger alert-notify"
  //   }
  // );


}
  
ViewEditDocument(Row: any) {
  // this.router.navigate(["/process/indexing/view/" + Row.AccNo]);
  this.router.navigate(['/process/indexing/view/', Row.AccNo], {relativeTo:this._activatedRoute, state: { rowData: Row }});
}
get cf(){
  return this.ContentSearchForm.controls;
}
}
