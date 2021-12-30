import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsComponent } from './reports.component';
import { LogsComponent } from './logs/logs.component';
import { StatusComponent } from './status/status.component';
import { MetadataComponent } from './metadata/metadata.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from 'app/core/auth/auth.interceptor';
import { reportRoutes } from './reports.routing';
import { RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule} from "@angular/material/form-field";
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  declarations: [
    ReportsComponent,
    LogsComponent,
    StatusComponent,
    MetadataComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(reportRoutes),
    DataTablesModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class ReportsModule { }
