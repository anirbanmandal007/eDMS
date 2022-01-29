import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { HttpClient } from '@angular/common/http';
import { UserConfirmationRequiredComponent } from '../user-confirmation-required/user-confirmation-required.component';
import { AuthService } from 'app/core/auth/auth.service';
import { UserManagementService } from '../user-management.service';
import { ToasterService } from 'app/shared/toaster/toaster.service';
import { ConfirmationDialogComponent, ConfirmDialogModel } from 'app/shared/confirmation-dialog/confirmation-dialog.component';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { fromEvent } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class UserComponent implements OnInit {
  //@ViewChild('AddUserNgForm') AddUserNgForm: NgForm;
  @ViewChild('openmenu') toggleButton: ElementRef;
  @ViewChild('data-menu') menu: ElementRef;
  
  role_id: string = '';
  loader:boolean =false;
  recId: any;
  openlist: boolean = false;
  text: string;
  modalopen: boolean = false;
  editform:FormGroup;
  displayTable: boolean =  false;
  editmodalopen: boolean = false;
  createmodalopen:boolean = false;
  AddUserForm: FormGroup;
  roleList: any;
  roleEdit: any;
  
  
  constructor(
    private renderer: Renderer2,
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _userManagementService: UserManagementService,
    private dialog: MatDialog,
    private toaster: ToasterService) {
  }
  dtOptions: DataTables.Settings = {};
  dataSource:any;
  dtTrigger: Subject<any> = new Subject<any>();

   //ng table data populate
   temp: any;
   columns = [{prop: 'name'}, {prop: 'userid'}, {prop: 'email'}, {prop: 'mobile'}, {prop: 'roleName'}];
   @ViewChild('search', { static: false }) search: any;

  ngOnInit(): void {
    this.loader = false;
    const that = this;
    this.dtOptions = {
      processing: true,
      ordering: true,
      info: false,
      searching: true,
      paging: true,
      pageLength:10,
      drawCallback() {
        that.displayTable = true;
      }
    }

    this.getUserList();

    this._userManagementService.getRolesData().subscribe(data => {
      this.roleList = data;
    });
    this.AddUserForm = this._formBuilder.group({
      id: [""],
      username: ["", Validators.required],
      userid: ["", Validators.required],
      pwd: ["", [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
      confirmPass: ["", Validators.required],
      email: ["", [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      ]],
      mobile: [""],
      role: ["", Validators.required]
      
    });
   
    this.editform = this._formBuilder.group({
      id: [""],
      name: new FormControl('', [Validators.required]),
      userid: ["", Validators.required],
      pwd: ["", Validators.required],
      confirmPass: ["", Validators.required],
      email: ["", [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      ]],
      mobile: [""],
      role: ["", Validators.required],
      
      User_Token: localStorage.getItem('User_Token'),
    });
  }

  //event handler for the select element's change event
  selectRole (event: any) {
    this.role_id = event.target.value;
  }
  getUserList() {
    this.loader = true;
    this._userManagementService.getUsersData().subscribe(data => {
     
      this.dataSource = data;
      this.temp=data;
      this.displayTable = true;
      this.loader = false;
    });
  }
  
  get f(){
    return this.editform.controls;
  }
  get cf(){
    return this.AddUserForm.controls;
  }
  openMenu(getId:any){
    this.recId = getId;
    this.openlist = true;
  }
 
  deleteRow(userId:any,userName:any){
    console.log("user id:"+userId);
    console.log("user Name:"+userName);
    const message = `Are you sure you want delete this user: `+userName+`?`;
    const dialogData = new ConfirmDialogModel("Confirm Deletion", message, 'Delete', 'Cancel');

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: "0",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult) {
        this.deleteUser(userId);
      } else {
      }
    });
  }
  
  closeeditDialog(){
    this.openlist = false;
    this.modalopen = false;
    this.editmodalopen = false;
  }
  closeDialog(){
    this.openlist = false;
    this.modalopen = false;
    this.createmodalopen = false;
  }
  CreateRow(){
    this.modalopen = true;
    this.createmodalopen = true;

    
  }
  createRowData(){
  console.log('Form data:' + JSON.stringify(this.AddUserForm.value));
  console.log('Username:' + this.AddUserForm.controls.username.value)
  console.log("true");
  // if(this.validateFields){
    let body = {
      name: this.AddUserForm.controls.username.value,
      userid: this.AddUserForm.controls.userid.value,
      pwd: this.AddUserForm.controls.pwd.value,
      confirmPass: this.AddUserForm.controls.confirmPass.value,
      email: this.AddUserForm.controls.email.value,
      mobile:String(this.AddUserForm.controls.mobile.value),
      role: this.AddUserForm.controls.role.value,
     
      User_Token: localStorage.getItem('User_Token'),
    }
    console.log(body)
  
    this._userManagementService.createUsersData(body).subscribe(data => {
      this.toaster.show('success', 'Created!', 'User created succesfully!');
      //this.dataSource = data;
      this.modalopen = false;
      this.createmodalopen = false;
      this.getUserList();
    });
  // }
 

}
editRow(userId:any){
  console.log("editing");
  this.openlist = false;
  this.modalopen = true;
  this.editmodalopen = true;

  this._userManagementService.getUsersDataById(userId).subscribe(data => {
    console.log(data)
    this.roleEdit = data.roleName;
    this.editform.setValue({
      id: data.id,
      name: data.name,
      userid: data.userid,
      pwd: data.pwd,
      confirmPass: '',
      email: data.email,
      mobile: data.mobile,
      role: data.roleName,
     
      User_Token: localStorage.getItem('User_Token'),
    });
    
  });
  
}
editRowdata(){
  let cpass;
  if(this.editform.controls.confirmPass){
    cpass = this.editform.controls.confirmPass.value
  }else{
    cpass = "";
  }

  let body = {
    name: this.editform.controls.name.value,
    userid: this.editform.controls.userid.value,
    pwd: this.editform.controls.pwd.value,
    confirmPass: cpass,
    email: this.editform.controls.email.value,
    mobile:String(this.editform.controls.mobile.value),
    sysRoleID:this.role_id,
    
    role: this.editform.controls.role.value
  }

  console.log("update body",body);
  this.closeeditDialog();
  this._userManagementService.updateUsersData(body).subscribe(data => {
    this.toaster.show('success', 'Updated!', 'User updated successfully!');
    //this.dataSource = data;
    this.modalopen = false;
    this.editmodalopen = false;
    this.getUserList();
  });
}
deleteUser(userId:any){
  let data = {
  "id":userId
  };
  this._userManagementService.deleteUsersData(data).subscribe(data => {
    this.toaster.show('success', 'Deleted!', 'User deleted successfully!');
    this.openlist = false;
    this.createmodalopen = false;
    this.getUserList();
  });   
}

  validateFields()
  {
    
    if (this.cf.username.value == "" )
    {
     
             this.showmessage("Please Enter name");
              return false;
    }
    if (this.cf.userid.value =="" )
    {
             this.showmessage("Please Enter userid");
              return false;
    }

    if (this.cf.email.value =="" )
    {
             this.showmessage("Please Enter Email");
              return false;
    }
    if (this.cf.pwd.value =="" )
    {
             this.showmessage("Please Enter pwd");
              return false;
    }
    if (this.cf.confirmPass.value =="" )
    {
             this.showmessage("Please Enter confirmPass");
              return false;
    }
    if (this.cf.sysRoleID.value <=0 )
    {
     
             this.showmessage("Please select role confirmPass");
              return false;
    }   

    return true;
  }
  showmessage(data:any)
  {
    /*
    console.log("error",data);
    this.toastr.show(
      '<div class="alert-text"</div> <span class="alert-title" data-notify="title">Validation ! </span> <span data-notify="message"> '+ data +' </span></div>',
      "",
      {
        timeOut: 3000,
        closeButton: true,
        enableHtml: true,
        tapToDismiss: false,
        titleClass: "alert-title",
        positionClass: "toast-top-center",
        toastClass:
          "ngx-toastr alert alert-dismissible alert-danger alert-notify"
      }
    );
*/

  }

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(event.target && event.target.innerText !== 'more_vert') {
      this.openlist = false;
    }
  }

  /* ng table data table populate */
  ngAfterViewInit(): void {
    // Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    // Add 'implements AfterViewInit' to the class.
    fromEvent(this.search.nativeElement, 'keydown')
      .pipe(
        debounceTime(550),
        map(x => x['target']['value'])
      )
      .subscribe(value => {
        this.updateFilter(value);
      });
  }

updateFilter(val: any) {
  const value = val.toString().toLowerCase().trim();
  // get the amount of columns in the table
  const count = this.columns.length;
  // get the key names of each column in the dataset
  const keys = ['name', 'userid','email', 'mobile','roleName'];
  // assign filtered matches to the active datatable
  this.dataSource = this.temp.filter(item => {
    // iterate through each row's column data
    for (let i = 0; i < count; i++) {
      // check for a match
      if (
        (item[keys[i]] &&
          item[keys[i]]
            .toString()
            .toLowerCase()
            .indexOf(value) !== -1) ||
        !value
      ) {
        // found match, return true to add to result set
        return true;
      }
    }
  });

  // Whenever the filter changes, always go back to the first page
  // this.table.offset = 0;
}
}
