import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { HttpService } from 'app/core/service/http.service';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  userToken: string;
  createdBy: string;
  constructor(
    private _httpService: HttpService,
    private _authService: AuthService
  ) {
    this.userToken = this._authService.accessToken;
    this.createdBy = JSON.parse(localStorage.getItem('userData')).id;
  }
/* template service */
  getTempListData() {
    const apiUrl = "Template/GetTemplate?UserID=1&user_Token="+ this.userToken
    return this._httpService.get(apiUrl);
  }
  addUpdateTemplateAPI(data:any){
    data["CreatedBy"]=this.createdBy;
    data["User_Token"]=this.userToken;
    console.log("addUpdateTemplateAPI:"+data);
    const apiUrl = "Template/Update"
    return this._httpService.post(apiUrl,data);
  }
  deleteTemplateAPI(data:any) {
    data["User_Token"]=this.userToken
    console.log(data);
    const apiUrl = "Template/Delete"
    return this._httpService.post(apiUrl,data);
  }
/* template service */

/* customer service */
getCustomerListData() {
  const apiUrl = "BranchMaster/GetBranchList?UserID=1&user_Token="+ this.userToken
  return this._httpService.get(apiUrl);
}
addUpdateCustomerAPI(data:any){
  data["CreatedBy"]=this.createdBy;
  data["User_Token"]=this.userToken;
  console.log("addUpdateCustomerAPI:"+data);
  const apiUrl = "BranchMaster/Update"
  return this._httpService.post(apiUrl,data);
}
deleteCustomerAPI(data:any) {
  data["User_Token"]=this.userToken
  console.log(data);
  const apiUrl = "BranchMaster/Delete"
  return this._httpService.post(apiUrl,data);
}
/* customer service */

/* region service */
getRegionListData() {
  const apiUrl = "Department/GetList?UserID=1&user_Token="+ this.userToken
  return this._httpService.get(apiUrl);
}
addUpdateRegionAPI(data:any){
  data["CreatedBy"]=this.createdBy;
  data["User_Token"]=this.userToken;
  console.log("addUpdateRegionAPI:"+data);
  const apiUrl = "Department/Update"
  return this._httpService.post(apiUrl,data);
}
deleteRegionAPI(data:any) {
  data["User_Token"]=this.userToken
  console.log(data);
  const apiUrl = "Department/Delete"
  return this._httpService.post(apiUrl,data);
}
/* region service */
}
