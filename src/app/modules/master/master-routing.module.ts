import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TemplateComponent } from './template/template.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomerMappingComponent } from './customer-mapping/customer-mapping.component';
import { TemplateMappingComponent } from './template-mapping/template-mapping.component';
import { RegionMappingComponent } from './region-mapping/region-mapping.component';
import { RegionComponent } from './region/region.component';
import { CustomFormComponent } from './custom-form/custom-form.component';

const routes: Routes = [
  {
      path     : '',
      children: [
          {path: 'template', component: TemplateComponent},
          {path: 'Customer', component: CustomerComponent},
          {path: 'customer-mapping', component: CustomerMappingComponent},
          {path: 'template-mapping', component: TemplateMappingComponent},
          {path: 'region-mapping', component: RegionMappingComponent},
          {path: 'Region', component: RegionComponent},
          {path: 'view-custom-form', component: CustomFormComponent},
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
