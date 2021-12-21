import { Injectable } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { HttpService } from 'app/core/service/http.service';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  userToken: string;

  constructor(
    private _httpService: HttpService,
    private _authService: AuthService
  ) {
    this.userToken = this._authService.accessToken;
  }

  getIndexingData() {
    const apiUrl = "DataEntry/GetPendingData?UserID=1&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }

  getIndexingFile(fileNo) {
    const apiUrl = "SearchFileStatus/GetFullFile?ID=1&user_Token="+ this.userToken + "&_fileName="+fileNo;
    return this._httpService.get(apiUrl);
  }

  getTemplates() {
    const apiUrl = "TemplateMapping/GetTemplateMappingListByUserID?UserID=1&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }
  
  getFields(tempId, fileNo) {
    const apiUrl = "DataEntry/GetFieldsName?id=" + tempId + "&FileNo=" + fileNo +"&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }

  getBranchList() {
    const apiUrl = "BranchMapping/GetBranchDetailsUserWise?ID=1&user_Token="+ this.userToken;
    return this._httpService.get(apiUrl);
  }
}
