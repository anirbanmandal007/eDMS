import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpRequest,
  HttpResponse,
  HttpParams,
  HttpHeaders
  // HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from 'environments/environment.prod';

// import { AuthService } from "../auth/auth.service";

const API_BASE_URL = environment.baseUrl;
// const API_BASE_URL_FILE_UP = '';
const API_BASE_URL_FILE_UP = environment.baseUrl;

export interface Payload { }

@Injectable(
  { providedIn: 'root' }
)
export class HttpService {

  private endPoint: string;

  constructor(
    private http: HttpClient,
    // private auth: AuthService
  ) { }

  isUserLoggedIn(): boolean {
    return localStorage.getItem('token') ? true : false;
  }

  /**
   * setApiEndpoint - This method will create and set the resolved api endpoint
   * @param route 
   * @param useRouteAsFullyQualifiedUrl 
   */
  setApiEndpoint(route: string): void {
    this.endPoint = API_BASE_URL + route;
  }

  /**
   * setApiEndpointForFileUpload - This method will create and set the resolved api endpoint
   * @param route 
   * @param useRouteAsFullyQualifiedUrl 
   */
  setApiEndpointFile(route: string): void {
    this.endPoint = API_BASE_URL_FILE_UP + route;
  }

  /**
   * getApiEndPoint - this method returns the set endpoint
   */
  getApiEndPoint(): string {
    return this.endPoint;
  }

  payloadToQueryParams(paramsPayload: Payload): HttpParams {
    let querParams = new HttpParams();
    for (let key in paramsPayload) {
      if (paramsPayload.hasOwnProperty(key)) {
        querParams = querParams.append(key, paramsPayload[key]);
      }
    }
    return querParams;
  }
7
  getDefaultHeaders(): HttpHeaders {
    let defaultHeaders = new HttpHeaders();
    defaultHeaders = defaultHeaders.set('Content-Type', 'application/json; charset=UTF-8');
    if (this.isUserLoggedIn()) {
      defaultHeaders = defaultHeaders.set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    }
    return defaultHeaders;
  }

  getDefaultHeadersForm(): HttpHeaders {
    let defaultHeaders = new HttpHeaders();
    // defaultHeaders = defaultHeaders.set('Content-Type', 'application/json; charset=UTF-8');
    if (this.isUserLoggedIn()) {
      defaultHeaders = defaultHeaders.set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    }
    return defaultHeaders;
  }

  get(route: string, paramsPayload?: Payload): Observable<any> {
    this.setApiEndpoint(route);
    let httpRequestOptions = {
      headers: this.getDefaultHeaders(),
      params: this.payloadToQueryParams(paramsPayload)
    };
    // if(this.isUserLoggedIn()){
    //   httpRequestOptions['withCredentials'] = true;
    // }
    return this.http.get(this.getApiEndPoint(), httpRequestOptions);
  }

  post(route: string, paramsPayload: Payload): Observable<any> {
    this.setApiEndpoint(route);
    let httpRequestOptions = { headers: this.getDefaultHeaders() };
    // if(this.isUserLoggedIn){
    //   httpRequestOptions['withCredentials'] = true;
    // }
    return this.http.post(this.getApiEndPoint(), paramsPayload, httpRequestOptions);
  }

  postFile(route: string, paramsPayload: Payload): Observable<any> {
    this.setApiEndpointFile(route);
    let formData = new FormData();
    formData.append('to',paramsPayload['to']);
    formData.append('subject',paramsPayload['subject']);
    formData.append('body',paramsPayload['body']);
    formData.append('attachments[]',paramsPayload['attachments'][0]);
    // if(this.isUserLoggedIn){
    //   httpRequestOptions['withCredentials'] = true;
    // }
    return this.http.post(this.getApiEndPoint(), formData);
  }

  updateFiles(route: string,paramsPayload: Payload): Observable<any> {
    this.setApiEndpointFile(route);
    let httpRequestOptions = { headers: this.getDefaultHeadersForm() };
    let formData = new FormData();
    Object.entries(paramsPayload).forEach(
      ([key, value]: any[]) => {
        if(key == 'qualificationFiles' || key == 'idCardFiles' || key == 'associationIdFiles' || key == 'guarantorFiles') {
          formData.append(key + '[]', value);
        } else {
          formData.append(key, value);
        }
      }
    )
    return this.http.put(this.getApiEndPoint(), formData , httpRequestOptions);
  }

  put(route: string ,paramsPayload?:any ): Observable<any> {
    this.setApiEndpoint(route);
    let httpRequestOptions = { headers: this.getDefaultHeaders() };
    return this.http.put(this.getApiEndPoint() , paramsPayload , httpRequestOptions);
  }

  patch(route: string ,paramsPayload?:any ): Observable<any> {
    this.setApiEndpoint(route);
    let httpRequestOptions = { headers: this.getDefaultHeaders() };
    return this.http.patch(this.getApiEndPoint() , paramsPayload , httpRequestOptions);
  }

  delete(route: string, paramsPayload?: Payload): Observable<any> {
    this.setApiEndpoint(route);
    let httpRequestOptions = {
      headers: this.getDefaultHeaders(),
      params: this.payloadToQueryParams(paramsPayload)
    };
    return this.http.delete(this.getApiEndPoint(), httpRequestOptions);
  }

}
