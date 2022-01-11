import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { HttpService } from 'app/core/service/http.service';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  userToken: string;
  createdBy: string;
  constructor(
    private _httpService: HttpService,
    private _authService: AuthService,
    private httpService: HttpClient
  ) {
    this.userToken = this._authService.accessToken;
    this.createdBy = JSON.parse(localStorage.getItem('userData')).id;
   }
   /** File Upload */
   GetBranchDetailsUserWise() {
    const apiUrl = "BranchMapping/GetBranchDetailsUserWise?ID=" + this.createdBy +"&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }
  GetSubFolderDetailsUserWise() {
    const apiUrl = "SubFolderMapping/GetSubFolderDetailsUserWise?UserID=" + this.createdBy +"&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }
  GetDocList() {
    const apiUrl = "DocMaster/GetDocList?user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }
  GetTemplateMappingListByUserID() {
    const apiUrl = "TemplateMapping/GetTemplateMappingListByUserID?UserID=" + this.createdBy +"&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }
  getDoctypeListByTempID(val:any) {
    const apiUrl = "DocTypeMapping/getDoctypeListByTempID?ID=" + this.createdBy +"&TemplateID="+val+"&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }

  GetSubFolderByBranchID(BranchID) {
    const apiUrl = "SubfolderController/GetSubFolderByBranchID?UserID=" + this.createdBy +"&BrnachID="+BranchID+"&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }
  UploadFiles(data:any){
    // data[""]=this.createdBy;
    data["User_Token"]=this.userToken;
    data.append('UserID',this.createdBy);
    console.log("addUpdateTemplateAPI:"+data);
    const apiUrl = environment.baseUrl+"FileUpload/UploadFiles"
    return this.httpService.post(apiUrl,data);
  }
  /** CSV Upload */

  getTemplateMappingListByUserID() {
    const apiUrl = "TemplateMapping/GetTemplateMappingListByUserID?UserID=" + this.createdBy +"&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }
  getFieldsName(id:any) {
    const apiUrl = "DataUpload/GetFieldsName?ID=" + id +"&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }
  uploadCsv(data:any){
   
    console.log("addUpdateTemplateAPI:"+data);
    const apiUrl = "DataUpload/Create"
    return this._httpService.post(apiUrl,data);
  }
  /** SFTP Upload */
  getDeptList() {
    const apiUrl = "Department/GetList?user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }
  getAllCount(){
    const apiUrl = "FileUpload/GetCountOnly?ID="+this.createdBy+"&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }
  getFileCount(deptid:any,bid:any){
    const apiUrl ="FileUpload/GetFileCount?ID="+deptid+"&user_Token="+this.userToken+"&BranchID="+bid;
    return this._httpService.get(apiUrl);
  }
  getCustomerList(userid:any){
    const apiUrl = "BranchMaster/GetBranchByDeptIDANDUserwise?UserID=" +this.createdBy+"&DeptID="+userid+ "&user_Token="+this.userToken;
    return this._httpService.get(apiUrl);
  }
  sftpupload(data:any){
   
    console.log("addUpdateTemplateAPI:"+data);
    const apiUrl = "FileUpload/SftpFileupload"
    return this._httpService.post(apiUrl,data);
  }
}
