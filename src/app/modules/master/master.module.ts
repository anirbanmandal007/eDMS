import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MasterRoutingModule } from "./master-routing.module";
import { MasterComponent } from './master.component';
import { TemplateComponent } from './template/template.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomerMappingComponent } from './customer-mapping/customer-mapping.component';
import { TemplateMappingComponent } from './template-mapping/template-mapping.component';
import { RegionMappingComponent } from './region-mapping/region-mapping.component';
import { RegionComponent } from './region/region.component';
import { CustomFormComponent } from './custom-form/custom-form.component';
import { DataTablesModule } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule} from "@angular/material/form-field";
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MasterComponent,
    TemplateComponent,
    CustomerComponent,
    CustomerMappingComponent,
    TemplateMappingComponent,
    RegionMappingComponent,
    RegionComponent,
    CustomFormComponent
  ],
  imports: [
    CommonModule,
    MasterRoutingModule,
    ReactiveFormsModule,
    DataTablesModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule
  ]
})
export class MasterModule { }
