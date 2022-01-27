import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { DataTablesModule } from 'angular-datatables';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule} from "@angular/material/form-field";
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NgxCaptchaModule } from 'ngx-captcha';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DataTablesModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        NgxDatatableModule,
        NgxDocViewerModule,
        NgxCaptchaModule,
        CalendarModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ConfirmationDialogComponent,
        DataTablesModule,
        MatIconModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatProgressSpinnerModule,
        NgxDatatableModule,
        NgxDocViewerModule,
        NgxCaptchaModule,
        CalendarModule
    ],
    declarations: [
        ConfirmationDialogComponent
    ]
})
export class SharedModule
{
}
