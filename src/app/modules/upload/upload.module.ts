import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadRoutingModule } from './upload-routing.module';
import { UploadComponent } from './upload.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { CsvUploadComponent } from './csv-upload/csv-upload.component';
import { SftpUploadComponent } from './sftp-upload/sftp-upload.component';
import { DataTablesModule } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule} from "@angular/material/form-field";
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SharedModule } from 'app/shared/shared.module';
import { FilterPipeModule } from "ngx-filter-pipe";
import {FileUploadModule} from 'primeng/fileupload';  

@NgModule({
  declarations: [
    UploadComponent,
    FileUploadComponent,
    CsvUploadComponent,
    SftpUploadComponent
  ],
  imports: [
    CommonModule,
    UploadRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    SharedModule,
    NgMultiSelectDropDownModule.forRoot(),
    FilterPipeModule,
    FileUploadModule
  ]
})
export class UploadModule { }
