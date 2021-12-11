import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { RouterModule } from '@angular/router';
import { userManagementRoutes } from './user-management.routing';
import { AuthInterceptor } from 'app/core/auth/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';


@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    RouterModule.forChild(userManagementRoutes),
    CommonModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class UserManagementModule { }
