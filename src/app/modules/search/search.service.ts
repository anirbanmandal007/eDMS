import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { HttpService } from 'app/core/service/http.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  userToken: string;
  private rolesChanged = new BehaviorSubject(new Date().getTime());
  isRoleChanged = this.rolesChanged.asObservable();
  userId = JSON.parse(localStorage.getItem('userData'))?.id;
  constructor(
    private _httpService: HttpService,
    private _authService: AuthService
  ) {
    this.userToken = this._authService.accessToken;
  }

  GetRootByUserID() {
    const apiUrl = "RootMaster/GetRootByUserID?UserID="+this.userId+"&user_Token="+this.userToken; 
    return this._httpService.get(apiUrl);
  }

  GetBranchByDeptIDANDUserwise(userid) {
    const apiUrl = "BranchMaster/GetBranchByDeptIDANDUserwise?UserID=" +this.userId+"&DeptID="+userid+ "&user_Token="+this.userToken;
    return this._httpService.get(apiUrl);
  }

  GetDepartmentByUserID(RootID) {
    const apiUrl = "Department/GetDepartmentByUserID?UserID="+this.userId+"&RoleID="+RootID+"&user_Token="+this.userToken;
    return this._httpService.get(apiUrl);
  }

  GetSubFolderByBranch(BranchID) {
    const apiUrl = "SubFolderMapping/GetSubFolderByBranch?UserID="+this.userId+"&CreatedBy="+this.userId+"&user_Token="+this.userToken+"&BranchID="+BranchID;
    return this._httpService.get(apiUrl);
  }




  getBranchByDept(deptId) {
    const apiUrl = "BranchMapping/GetBranchByDeptUserWise?ID="+this.userId+"&user_Token="+this.userToken+"&DeptID="+deptId;
    return this._httpService.get(apiUrl);
  }

  getDepartmentList() {
    const apiUrl = 'DepartmentMapping/GetDepartmentByUser?ID='+ this.userId+'&user_Token='+this.userToken;
    return this._httpService.get(apiUrl);
  }

  GetSubfolderByBranchID(branchId) {
    const apiUrl = 'SubfolderController/GetSubFolderByBranchID?UserID='+this.userId+'&BrnachID='+branchId+'&user_Token='+this.userToken;
    return this._httpService.get(apiUrl);
  }

  getSearchParameterList(TID) {
    const apiUrl = 'SearchFileStatus/getSearchParameterList?ID=' + TID + '&user_Token='+ this.userToken;
    return this._httpService.get(apiUrl);
  }

  getDoctypeListByTempID(TID) {
    const apiUrl = 'DocTypeMapping/getDoctypeListByTempID?ID=' + this.userId + '&TemplateID='+ TID +'&user_Token='+this.userToken;
    return this._httpService.get(apiUrl);
  }

  getBranchList() {
    const apiUrl = "BranchMapping/GetBranchDetailsUserWise?ID=" + this.userId + "&user_Token=" + this.userToken;
    return this._httpService.get(apiUrl);
  }

  GetTemplateMappingListByUserID() {
    const apiUrl = 'TemplateMapping/GetTemplateMappingListByUserID?UserID=' + this.userId + '&user_Token=' + this.userToken;
    return this._httpService.get(apiUrl);
  }

  getSearchDataByFolderStructure(tempID) {
    const apiUrl = 'SearchFileStatus/getSearchDataByFolderStructure?UserID=' + this.userId + '&user_Token=' + this.userToken + '&TemplateID=' + tempID;
    return this._httpService.get(apiUrl);
  }

  GetFieldsName(TID) {
    const apiUrl = 'DataUpload/GetFieldsName?ID='+TID+'&user_Token='+ this.userToken;
    return this._httpService.get(apiUrl);
  }

  DownloadFileFromDB(_FileNo) {
    const apiUrl = 'SearchFileStatus/DownloadFileFromDB?ID=' + this.userId + '&FileNo= ' + _FileNo + ' &user_Token=' + this.userToken;
    return this._httpService.get(apiUrl);
  }

  DownloadTagFile(row) {
    const apiUrl = 'SearchFileStatus/DownloadTagFile?ID='+this.userId+'&DocID='+row.DocID+'&_fileName='+row.AccNo+'&user_Token='+this.userToken;
    return this._httpService.get(apiUrl);
  }

  Setfavourite(data) {
    data["User_Token"]=this.userToken
    const apiUrl = "SearchFileStatus/Setfavourite"
    return this._httpService.post(apiUrl,data);
  }

  DeleteFile(data) {
    data["User_Token"]=this.userToken
    const apiUrl = "SearchFileStatus/Delete"
    return this._httpService.post(apiUrl,data);
  }

  uploadFiles(data) {
    data["User_Token"]=this.userToken
    const apiUrl = "SearchFileStatus/Upload"
    return this._httpService.post(apiUrl,data);
  }

  GetNextFile(__TempID, __FileNo) {
    const apiUrl = 'DataEntry/GetNextFile?id='+__TempID+'&FileNo='+__FileNo+'&user_Token='+ this.userToken;
    return this._httpService.get(apiUrl);
  }

  GetFullFile(FileNo) {
    const apiUrl = 'SearchFileStatus/GetFullFile?ID='+this.userId+'&&_fileName='+ FileNo +'&user_Token='+this.userToken;
    return this._httpService.get(apiUrl);
  }

  GetDocumentDetails(AccNo) {
    const apiUrl = 'SearchFileStatus/GetDocumentDetails?FileNo=' + AccNo + '&UserID=' + this.userId + '&user_Token=' + this.userToken;
    return this._httpService.get(apiUrl);
  }

  GetTagFile(doc) {
    const apiUrl = 'SearchFileStatus/GetTagFile?ID='+this.userId+'&DocID='+doc.DocID+'&_fileName='+doc.AccNo+'&user_Token='+this.userToken;
    return this._httpService.get(apiUrl);
  }

  downloadBulkFileBYCSV(data) {
    data["User_Token"]=this.userToken
    const apiUrl = "SearchFileStatus/DLoadBulkFiles"
    return this._httpService.post(apiUrl,data);
  }

  getSearchDataByFilter(data) {
    data["User_Token"]=this.userToken
    const apiUrl = "SearchFileStatus/getSearchDataByFilter"
    return this._httpService.post(apiUrl,data);
  }

  GetMetaDataFileNo(data) {
    data["User_Token"]=this.userToken
    const apiUrl = "Status/GetMetaDataFileNo"
    return this._httpService.post(apiUrl,data);
  }

  SendEmailBulkFiles(data) {
    data["User_Token"]=this.userToken
    const apiUrl = "Status/GetMetaDataFileNo"
    return this._httpService.post(apiUrl,data);
  }

  SendEmail(data) {
    data["User_Token"]=this.userToken
    const apiUrl = "Status/GetMetaDataFileNo"
    return this._httpService.post(apiUrl,data);
  }
}
