import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { RouterModule } from '@angular/router';
import { userManagementRoutes } from './user-management.routing';
import { DataTablesModule } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule} from "@angular/material/form-field";
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from 'app/core/auth/auth.interceptor';
import { SharedModule } from 'app/shared/shared.module';
// import { AddUserComponent } from './add-user/add-user.component';


@NgModule({
  declarations: [
    UserComponent,
    // AddUserComponent
  ],
  imports: [
    RouterModule.forChild(userManagementRoutes),
    CommonModule,
    SharedModule,
    DataTablesModule,
    MatIconModule,
    // MatGridListModule,
    // MatGridTile,
    MatFormFieldModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class UserManagementModule { }
