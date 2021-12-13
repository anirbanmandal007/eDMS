import { Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { HttpClient } from '@angular/common/http';
import { UserConfirmationRequiredComponent } from '../user-confirmation-required/user-confirmation-required.component';
import { AuthService } from 'app/core/auth/auth.service';
import { UserManagementService } from '../user-management.service';

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


  recId: any;
  openlist: boolean = false;
  text: string;
  modalopen: boolean = false;
  editform:FormGroup;
  displayTable: boolean =  false;
  editmodalopen: boolean = false;
  createmodalopen:boolean = false;
  AddUserForm: FormGroup;
  
  
  constructor(
    private renderer: Renderer2,
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _userManagementService: UserManagementService,
    //public toastr: ToastrService,
    private dialog: MatDialog) { 
    this.renderer.listen('window', 'click',(e:Event)=>{

      
     if(this.toggleButton.nativeElement && this.menu.nativeElement && e.target !== this.toggleButton.nativeElement && e.target!==this.menu.nativeElement ){
         this.openlist=false;
     }
 });
 
  }
  dtOptions: ADTSettings = {};
  
  dataSource:any;


  ngOnInit(): void {
    this.geUserList();

    this.AddUserForm = this._formBuilder.group({
      id: [""],
      username: ["", Validators.required],
      userid: ["", Validators.required],
      pwd: ["", Validators.required],
      confirmPass: ["", Validators.required],
      email: ["", [Validators.required, Validators.pattern(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      ]],
      mobile: [""],
      role: ["", Validators.required],
      Remarks: [""]
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
      Remarks: [""],
      User_Token: localStorage.getItem('User_Token'),
    });

    
    
  }
  geUserList() {
    this._userManagementService.getUsersData().subscribe(data => {
      this.dataSource = data;
      this.displayTable = true;
    });

    setTimeout(() => {
      this.dtOptions = {
        processing: true,
        ordering: true,
        info: false,
        searching: true,
        paging: true,
        pageLength:10
        
      };
    }, 1000);
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
  editRowdata(userId:any){
    this.openlist = false;
    this.modalopen = true;
    this.editmodalopen = true;
  }
  deleteRow(userId:any,userName:any){
    this.openlist = false;
    const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.data = userName;
       

        this.dialog.open(UserConfirmationRequiredComponent, dialogConfig);
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
  CreateRowData(){
   console.log('Form data:' + JSON.stringify(this.AddUserForm.value));
   console.log('Username:' + this.AddUserForm.controls.username.value)
  //   console.log("true");
  //   let body = {
  //     name: this.cf.name.value,
  //     userid: this.cf.userid.value,
  //     pwd: this.cf.pwd.value,
  //     confirmPass: this.cf.confirmPass.value,
  //     email: this.cf.email.value,
  //     mobile: this.cf.mobile.value,
  //     sysRoleID:0,
  //     Remarks: this.cf.Remarks.value
  //   }

  //   const apiUrl1 = "https://e-storage.crownims.com/SODDMS/api/Admin/Create?user_Token=3D72E6CB-68DF-4FCB-8AD1-E05AA";
  //   this.http.post(apiUrl1,body).subscribe((data: {}) => {
  //     console.log("data",data);
  //   });

  //   // if(this.AddUserForm.value.User_Token == null) {
  //   //   this.AddUserForm.value.User_Token = localStorage.getItem('User_Token');
  //   // }
  //   // if (this.AddUserForm.get('id').value) {
  //   //  // console.log('Form',this.AddUserForm.value);
  //   //   //console.log('Inside Edit');
  //   //   const apiUrl = "Admin/Update";
     
  //   // } else {
     
      
  //   // }
  }
  editRow(){
    
  }
  validateFields()
  {
    if (this.cf.username.value =="" )
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
}
