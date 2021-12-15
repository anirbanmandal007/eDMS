import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { SnackbarComponent } from './snackbar/snackbar.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ConfirmationDialogComponent
    ],
    declarations: [
      ConfirmationDialogComponent,
      SnackbarComponent
    ]
})
export class SharedModule
{
}
