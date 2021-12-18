import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { HttpService } from 'app/core/service/http.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  userToken: string;

  constructor(
    private _httpService: HttpService,
    private _authService: AuthService
  ) {
    this.userToken = this._authService.accessToken;
  }

  getAllRights(id:any) {
    const apiUrl = "Role/GetRightList?ID="+id+"&user_Token="+ this.userToken
    return this._httpService.get(apiUrl);
  }
}
