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



@NgModule({
  declarations: [
    ReportsComponent,
    LogsComponent,
    StatusComponent,
    MetadataComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(reportRoutes),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class ReportsModule { }
