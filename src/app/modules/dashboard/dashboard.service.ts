import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { HttpService } from 'app/core/service/http.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

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

  GetBranchByDeptIDANDUserwise() {
    const apiUrl = "RootMaster/GetBranchByDeptIDANDUserwise?UserID="+this.userId+"&user_Token="+this.userToken;
    return this._httpService.get(apiUrl);
  }

  GetDepartmentByUserID(RoleID) {
    const apiUrl = "RootMaster/GetDepartmentByUserID?RoleID="+RoleID+"&UserID="+this.userId+"&user_Token="+this.userToken;
    return this._httpService.get(apiUrl);
  }

  GetSubFolderByBranch(BranchID) {
    const apiUrl = "RootMaster/GetSubFolderByBranch?BranchID="+BranchID+"&UserID="+this.userId+"&user_Token="+this.userToken;
    return this._httpService.get(apiUrl);
  }

  GetStatusCount() {
    const apiUrl = "Status/GetStatusCount?userID=0&user_Token="+this.userToken;
    return this._httpService.get(apiUrl);
  }

  GetActivityCount() {
    const apiUrl = "Status/GetActivityCount?userID=0&user_Token="+this.userToken;
    return this._httpService.get(apiUrl);
  }

  GetDashboardData() {
    const apiUrl = "Status/GetDashboardData?userID=0&user_Token="+this.userToken;
    return this._httpService.get(apiUrl);
  }

  GetDashboardFileData() {
    const apiUrl = "Status/GetDashboardFileData?userID=0&user_Token="+this.userToken;
    return this._httpService.get(apiUrl);
  }

  GetActivityUserLog() {
    const apiUrl = "Status/GetActivityUserLog?userID=0&user_Token="+this.userToken;
    return this._httpService.get(apiUrl);
  }
}
