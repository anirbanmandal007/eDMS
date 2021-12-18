import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { RouterModule } from '@angular/router';
import { userManagementRoutes } from './user-management.routing';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from 'app/core/auth/auth.interceptor';
import { SharedModule } from 'app/shared/shared.module';
import { RoleManagementComponent } from './role-management/role-management.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [
    UserComponent,
    RoleManagementComponent,
    ChangePasswordComponent,
    // AddUserComponent
  ],
  imports: [
    RouterModule.forChild(userManagementRoutes),
    CommonModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class UserManagementModule { }
