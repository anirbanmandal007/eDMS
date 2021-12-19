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

  constructor(
    private _httpService: HttpService,
    private _authService: AuthService
  ) {
    this.userToken = this._authService.accessToken;
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
  GetRootByUserID($uid) {
    const apiUrl = "RootMaster/GetRootByUserID?UserID="+ $uid + "&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }
  GetBranchByDeptIDANDUserwise($uid,$deptId) {
    const apiUrl = "BranchMaster/GetBranchByDeptIDANDUserwise?UserID="+ $uid+"&DeptID="+$deptId + "&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }
  GetDepartmentByUserID($uid,$roleId) {
    const apiUrl = "Department/?UserID="+ $uid+"&RoleID="+$roleId + "&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }
  GetTemplateMappingListByUserID($uid) {
    const apiUrl = "TemplateMapping/GetTemplateMappingListByUserID?UserID="+ $uid + "&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }
  GetMetaDataReport(data) {
   
    const apiUrl = "Status/GetMetaDataReport"
    return this._httpService.post(apiUrl,data);
  }
  GetFieldsName($uid) {
    const apiUrl = "DataUpload/GetFieldsName?ID="+ $uid + "&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }
  /** MetaData Api */


}
