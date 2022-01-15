import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { HttpService } from 'app/core/service/http.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class reportsService {

  userToken: string;
  private rolesChanged = new BehaviorSubject(new Date().getTime());
  isRoleChanged = this.rolesChanged.asObservable();
  createdBy: any;

  constructor(
    private _httpService: HttpService,
    private _authService: AuthService
  ) {
    this.userToken = this._authService.accessToken;
    this.createdBy = JSON.parse(localStorage.getItem('userData')).id;
  }

  /** Status Api */

  getTemplateData($uid) {
    const apiUrl = "TemplateMapping/GetTemplateMappingListByUserID?UserID="+ $uid + "&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }

  showStatus(data) {
   
    const apiUrl = "Status/GetStatusReport"
    return this._httpService.post(apiUrl,data);
  }
  /** Status Api */
  /** Log Api */
  getCustomer($uid) {
    const apiUrl = "BranchMapping/GetBranchDetailsUserWise?ID="+ $uid + "&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }
  getTemplateHeader($uid) {
    const apiUrl = "DataUpload/GetFieldsName?ID=  "+ $uid + "&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }
  showLog(data) {
   
    const apiUrl = "Status/GetActivityReport"
    return this._httpService.post(apiUrl,data);
  }
  /** Log Api */
  /** MetaData Api */
  getRootByUserID($uid) {
    const apiUrl = "RootMaster/GetRootByUserID?UserID="+ $uid + "&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }
  getBranchByDeptIDANDUserwise($uid,$deptId) {
    const apiUrl = "BranchMaster/GetBranchByDeptIDANDUserwise?UserID="+ $uid+"&DeptID="+$deptId + "&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }
  getDepartmentByUserID($uid,$roleId) {
    const apiUrl = "Department/?UserID="+ $uid+"&RoleID="+$roleId + "&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }
  getTemplateMappingListByUserID() {
    const apiUrl = "TemplateMapping/GetTemplateMappingListByUserID?UserID="+ this.createdBy + "&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }
  getCustomerByUserID() {
    const apiUrl = "BranchMapping/GetBranchDetailsUserWise?ID="+ this.createdBy + "&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }
  getMetaDataReport(data) {
    data["User_Token"]=this.userToken;
    const apiUrl = "Status/GetMetaDataReport"
    return this._httpService.post(apiUrl,data);
  }
  getFieldsName($uid) {
    const apiUrl = "DataUpload/GetFieldsName?ID="+ $uid + "&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }
  /** MetaData Api */


}
