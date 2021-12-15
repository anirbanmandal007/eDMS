import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { UserManagementService } from '../user-management.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ChangePasswordComponent implements OnInit {
  submitted = false;
  changepasswordform:FormGroup;
  constructor(
    private _formBuilder:FormBuilder,
    private _userManagementService: UserManagementService
    ) {}

  ngOnInit(): void {
    this.changepasswordform = this._formBuilder.group({
      pwd: ["", Validators.required],
      confirmPass: ["", Validators.required]
    });
  }

  onSubmit(){
    this.submitted = true;
    let body = {
      pwd: this.changepasswordform.controls.pwd.value,
      confirmPass: this.changepasswordform.controls.confirmPass.value
    }
    console.log(body)
    this._userManagementService.changepassword(body).subscribe(data => {
      alert("Password update");
    });
  }
}
