import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { defaultNavigation } from 'app/mock-api/common/navigation/data';

@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthSignInComponent implements OnInit
{
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signInForm: FormGroup;
    showAlert: boolean = false;

    public captchaIsLoaded = false;
    public captchaSuccess = false;
    public captchaIsExpired = false;
    public captchaResponse?: string;

    public theme: 'light' | 'dark' = 'light';
    public size: 'compact' | 'normal' = 'normal';
    public lang = 'en';
    public type: 'image' | 'audio';
    

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.signInForm = this._formBuilder.group({
            username     : ['', [Validators.required]],
            password  : ['', Validators.required],
            recaptcha: ['', Validators.required],
            rememberMe: ['']
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void
    {
        // Return if the form is invalid
        if ( this.signInForm.invalid )
        {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._authService.signIn(this.signInForm.value)
            .subscribe((response) => {
                if(response.length === 0) {
                    // Re-enable the form
                    this.signInForm.enable();

                    // Reset the form
                    this.signInNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'Wrong username or password'
                    };

                    // Show the alert
                    this.showAlert = true;
                    return;
                }
                // Get Module Rights
                localStorage.setItem('username', this.signInForm.controls.username.value);
                this._authService.getModuleRights().subscribe((res: any) => {
                    this._authService.setModuleRights(res);
                    // Set the redirect url.
                    // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                    // to the correct page after a successful sign in. This way, that url can be set via
                    // routing file and we don't have to touch here.

                    // TODO: Get first module where logged in user has access
                    // const moduleToRedirect = res.find(el => el.isChecked).page_name;
                    // console.log(defaultNavigation);
                    // const urlToRedirect = defaultNavigation.find(el => el.id.toLocaleLowerCase() === moduleToRedirect.toLocaleLowerCase())?.link;
                    
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/dashboard';

                    // Navigate to the redirect url
                    this._router.navigateByUrl(redirectURL);
                });
            }
        );
    }

    handleSuccess(data) {
        console.log(data);
    }
}
