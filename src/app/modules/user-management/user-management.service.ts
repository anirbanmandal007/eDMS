import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { HttpService } from 'app/core/service/http.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  userToken: string;

  constructor(
    private _httpService: HttpService,
    private _authService: AuthService
  ) {
    this.userToken = this._authService.accessToken;
  }
  /** User api call start */
  getUsersData() {
    const apiUrl = "Admin/GetList?user_Token="+ this.userToken
    return this._httpService.get(apiUrl);
  }

  createUsersData(data) {
    data["User_Token"]=this.userToken
    console.log(data);
    const apiUrl = "Admin/Create"
    return this._httpService.post(apiUrl,data);
  }

  getUsersDataById(id:any) {
    const apiUrl = "Admin/GetDetails?ID="+id+"&user_Token="+ this.userToken
    return this._httpService.get(apiUrl);
  }

  updateUsersData(data) {
    data["User_Token"]=this.userToken
    console.log(data);
    const apiUrl = "Admin/Update"
    return this._httpService.post(apiUrl,data);
  }
  deleteUsersData(data:any) {
    data["User_Token"]=this.userToken
    console.log(data);
    const apiUrl = "Admin/Delete"
    return this._httpService.post(apiUrl,data);
  }

  /** User api call end */
  /** Role api call start */

  getRolesData() {
    const apiUrl = "Role/GetList?user_Token="+ this.userToken
    return this._httpService.get(apiUrl);
  }

  createRolesData(data) {
    data["User_Token"]=this.userToken
    console.log(data);
    const apiUrl = "Admin/Create"
    return this._httpService.post(apiUrl,data);
  }

  getRolesDataById(id:any) {
    const apiUrl = "Admin/GetDetails?ID="+id+"&user_Token="+ this.userToken
    return this._httpService.get(apiUrl);
  }

  updateRolesData(data) {
    data["User_Token"]=this.userToken
    console.log(data);
    const apiUrl = "Admin/Update"
    return this._httpService.post(apiUrl,data);
  }

  /** Role api call end */

  /** Change password api call end */
  changepassword(data:any) {
    let user_information = localStorage.getItem('userData');
    let user_informationObj = JSON.parse(user_information);
    console.log(user_informationObj.id);
    data["CreatedBy"]=user_informationObj.id
    data["User_Token"]=this.userToken
    console.log(data);
    const apiUrl = "UserLogin/Changepassword"
    return this._httpService.post(apiUrl,data);
  }
  /** change password api call end */
}
