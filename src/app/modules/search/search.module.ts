import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { searchRoutes } from './search.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentSearchComponent } from './content-search/content-search.component';
import {TableModule} from 'primeng/table';
import {CheckboxModule} from 'primeng/checkbox';
import { DeleteFilesComponent } from './delete-files/delete-files.component';
import { BulkDownloadComponent } from './bulk-download/bulk-download.component';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { FileStorageComponent } from './file-storage/file-storage.component';
import {MatMenuModule} from '@angular/material/menu';
import {TreeModule} from 'primeng/tree';
import { keywordSearchComponent } from './keyword-search/keyword-search.component';



@NgModule({
  declarations: [
    SearchComponent,
    ContentSearchComponent,
    DeleteFilesComponent,
    BulkDownloadComponent,
    AdvancedSearchComponent,
    FileStorageComponent,
    keywordSearchComponent
  ],
  imports: [
    RouterModule.forChild(searchRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TableModule,
    CheckboxModule,
    MatMenuModule,
    TreeModule
  ]
})
export class SearchModule { }
