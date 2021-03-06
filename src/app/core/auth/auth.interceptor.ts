import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError, of, switchMap } from 'rxjs';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor
{
    /**
     * Constructor
     */
    constructor(private _authService: AuthService, private _userService: UserService, private _router: Router
    )
    {
    }

    /**
     * Intercept
     *
     * @param req
     * @param next
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
    {
        // Clone the request object
        let newReq = req.clone();

        // Request
        //
        // If the access token didn't expire, add the Authorization header.
        // We won't add the Authorization header if the access token expired.
        // This will force the server to return a "401 Unauthorized" response
        // for the protected API routes which our response interceptor will
        // catch and delete the access token from the local storage while logging
        // the user out from the app.
        // if ( this._authService.accessToken && !AuthUtils.isTokenExpired(this._authService.accessToken) )
        if ( this._authService.accessToken )
        {
            newReq = req.clone({
                headers: req.headers.set('user_Token', this._authService.accessToken)
            });
        }

        // Response
        return next.handle(newReq).pipe(
            catchError((error) => {

                // Catch "401 Unauthorized" responses
                if ( error instanceof HttpErrorResponse && error.status === 401 )
                {
                    // Sign out
                    this._authService.signOut(this._authService.accessToken, this._userService.user[0].id);

                    // Reload the app
                    location.reload();
                }

                // Catch Invalid token responses
                if ( error.error && error.error.Message === 'Invalid token!!!' )
                {
                    this._authService._authenticated = false;
                    this._authService.removeAccessToen();
                    this._router.navigate(['sign-in']).then(() => {
                        window.location.reload();
                    });
                }

                return throwError(error);
            })
        );
    }
}
