import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment.prod';
import { delay } from "rxjs/operators"

@Injectable()
export class AuthService
{
    _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('User_Token', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('User_Token') ?? '';
    }

    get loggedInUserId(): string {
        return JSON.parse(localStorage.getItem('userData'))?.sysRoleID || 1;
    }

    setModuleRights(rights: any) {
        localStorage.setItem('ModuleRights', JSON.stringify(rights));
    }

    moduleRights() {
        return JSON.parse(localStorage.getItem('ModuleRights'));
    }

    removeAccessToen() {
        localStorage.removeItem('User_Token');
        localStorage.removeItem('userData');
        localStorage.removeItem('token');
        localStorage.removeItem('_RoleRemark');
        localStorage.removeItem('_RoleName');
        localStorage.removeItem('rowData');
        localStorage.removeItem('ModuleRights');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    getBaseUrl() {
        return environment.baseUrl;
    }

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { username: string; password: string }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }
        const url = this.getBaseUrl() + 'UserLogin/Create'
        return this._httpClient.post(url, credentials).pipe(
            switchMap((response: any) => {
                if(response.length !== 0) {
                    // // Store the access token in the local storage
                    this.accessToken = response[0].User_Token;

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = response[0];
                    this._userService.setUserData(JSON.stringify(response[0]));

                    // Return a new observable with the response
                }
                
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        if(localStorage.getItem('User_Token') && localStorage.getItem('User_Token') === 'undefined') {
            // Set the authenticated flag to false
            this._authenticated = false;
        } else {
            // Set the authenticated flag to true
            this._authenticated = true;
        }
        return of(this._authenticated);
        // Renew token
        // return this._httpClient.post('api/auth/refresh-access-token', {
        //     accessToken: this.accessToken
        // }).pipe(
        //     catchError(() =>

        //         // Return false
        //         of(false)
        //     ),
        //     switchMap((response: any) => {

        //         // Store the access token in the local storage
        //         this.accessToken = response.accessToken;

        //         // Set the authenticated flag to true
        //         this._authenticated = true;

        //         // Store the user on the user service
        //         this._userService.user = response.user;

        //         // Return true
        //         return of(true);
        //     })
        // );
    }

    /**
     * Sign out
     */
    signOut(user_Token: string, UserID: string): Observable<any>
    {
        // Remove the access token from the local storage
        const url = this.getBaseUrl() + 'UserLogin/Logout?user_Token='+user_Token+'&UserID='+UserID;
        return this._httpClient.get(url).pipe(
            switchMap((response: any) => {
                // Set the authenticated flag to false
                this._authenticated = false;
                this.removeAccessToen();
                return of(response);
            })
        );
        
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        // Check the access token expire date
        // if ( AuthUtils.isTokenExpired(this.accessToken) )
        // {
        //     return of(false);
        // }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }

    getModuleRights() {
        const url = this.getBaseUrl() + 'Role/GetPageList?user_Token='+this.accessToken+'&ID='+this.loggedInUserId;
        return this._httpClient.get(url);
    }
}
