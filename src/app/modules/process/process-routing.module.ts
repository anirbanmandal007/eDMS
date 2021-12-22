import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditIndexingComponent } from './edit-indexing/edit-indexing.component';
import { IndexingComponent } from './indexing/indexing.component';
import { ViewIndexingComponent } from './view-indexing/view-indexing.component';

const routes: Routes = [
  {
    path     : '',
    children: [
        {path: 'indexing', component: IndexingComponent},
        {path: 'indexing/view/:id', component: ViewIndexingComponent},
        {path: 'indexing/edit/:id', component: EditIndexingComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessRoutingModule { }
