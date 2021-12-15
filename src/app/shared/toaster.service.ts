import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { SnackbarComponent } from './snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private _snackBar: MatSnackBar) { }

  showToaster(message, type?) {
    this._snackBar.openFromComponent(SnackbarComponent, {
      data: {
        html: '<p class="'+type+'">'+message+'</p>'
      },
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }
}
