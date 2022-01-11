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

@NgModule({
  declarations: [
    SearchComponent,
    ContentSearchComponent
  ],
  imports: [
    RouterModule.forChild(searchRoutes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TableModule,
    CheckboxModule
  ]
})
export class SearchModule { }
