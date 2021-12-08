import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { RouterModule } from '@angular/router';
import { userManagementRoutes } from './user-management.routing';



@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    RouterModule.forChild(userManagementRoutes),
    CommonModule
  ]
})
export class UserManagementModule { }
