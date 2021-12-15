import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-user-confirmation-required',
  templateUrl: './user-confirmation-required.component.html',
  styleUrls: ['./user-confirmation-required.component.scss']
})
export class UserConfirmationRequiredComponent implements OnInit {
  name: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<UserConfirmationRequiredComponent> ) {

      this.name = data.name;

   }

  ngOnInit(): void {
  }
  delete(){
    this.dialogRef.close();
  }
}
