import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CsvUploadComponent } from "./csv-upload/csv-upload.component";
import { FileUploadComponent } from "./file-upload/file-upload.component";
import { SftpUploadComponent } from "./sftp-upload/sftp-upload.component";

const routes: Routes = [{
  path     : '',
  children: [
      {path: 'file-upload', component: FileUploadComponent},
      {path: 'data-upload', component: CsvUploadComponent},
      {path: 'sftpupload', component: SftpUploadComponent}
     
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UploadRoutingModule { }
