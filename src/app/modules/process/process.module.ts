import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcessRoutingModule } from './process-routing.module';
import { ProcessComponent } from './process.component';
import { IndexingComponent } from './indexing/indexing.component';
import { ViewIndexingComponent } from './view-indexing/view-indexing.component';
import { EditIndexingComponent } from './edit-indexing/edit-indexing.component';


@NgModule({
  declarations: [
    ProcessComponent,
    IndexingComponent,
    ViewIndexingComponent,
    EditIndexingComponent
  ],
  imports: [
    CommonModule,
    ProcessRoutingModule
  ]
})
export class ProcessModule { }
