import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IndexingComponent } from './indexing/indexing.component';

const routes: Routes = [
  {
    path     : '',
    children: [
        {path: 'indexing', component: IndexingComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessRoutingModule { }
