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
}
