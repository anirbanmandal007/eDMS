import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { UserConfirmationRequiredComponent } from '../user-confirmation-required/user-confirmation-required.component';
import { UserManagementService } from '../user-management.service';
import { ToasterService } from 'app/shared/toaster.service';
import { ConfirmationDialogComponent, ConfirmDialogModel } from 'app/shared/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {
  @ViewChild('openmenu') toggleButton: ElementRef;
  @ViewChild('data-menu') menu: ElementRef;
  dataSource: any;
  displayTable: boolean;
  dtOptions: any;
  selectedId: any;
  editmodalopen:boolean = false;
  modalopen:boolean = false;
  createmodalopen:boolean = false; 
  openlist: boolean = false;

AddRoleForm: FormGroup; 
submitted = false;
Reset = false;     
sMsg: string = '';   
UserList:any;
_PageList: any;
PageViewList : any;
_RightList:any;
_RoleList :any;  
_UserList:any; 
myFiles: string[] = [];  
_PageIDAndChk:any;
_pageRights:any;

  constructor(
    private renderer: Renderer2,
    private __formBuilder: FormBuilder,
    private _authService: AuthService,
    private _userManagementService: UserManagementService,
    private dialog: MatDialog,
    private router:Router,
    private _toasterService: ToasterService) {
    this.renderer.listen('window', 'click',(e:Event)=>{
      if(this.toggleButton && this.toggleButton.nativeElement && this.menu.nativeElement && e.target !== this.toggleButton.nativeElement && e.target!==this.menu.nativeElement ){
          this.openlist=false;
      }
  });
   }
   get rf() { return this.AddRoleForm; }
   get roles() { return this.AddRoleForm.get('Roles') as FormArray; }
   get _PageRight() { return this.AddRoleForm.get('_PageRight') as FormArray; }
  ngOnInit(): void {
    this.geRoleList();
    this.AddRoleForm = this.__formBuilder.group({     
      roleName: ['', Validators.required],
      remarks: ['', Validators.required],
      User_Token: localStorage.getItem('User_Token') ,
      CreatedBy: localStorage.getItem('UserID') ,
      Roles: this.__formBuilder.array([]),
      SelectAll: [false],
      SelectAllRights: [false],
      _PageIDAndChk:"",
      pageRights:"",
      _PageRight: this.__formBuilder.array([]),
    });



    let _RoleID= localStorage.getItem('_RoleID') ; 

    if (Number(_RoleID) > 0)
    {
    this._PageList(Number(_RoleID) );
    this._RightList(Number(_RoleID) );
    this.AddRoleForm.controls['roleName'].setValue(localStorage.getItem('_RoleName'));
    this.AddRoleForm.controls['remarks'].setValue(localStorage.getItem('_RoleRemark'));  

    }
    else 
    {
    this._PageList(0);
    this._RightList(0); 

    }
  }
  geRoleList() {
    this._userManagementService.getRolesData().subscribe(data => {
      this.dataSource = data;
      console.log("this.dataSource",this.dataSource);
      this.dtOptions = {
        processing: true,
        ordering: true,
        info: false,
        searching: true,
        paging: true,
        pageLength:10
      }
      this.displayTable = true;
    });
  }
  openMenu(id:any){
    this.selectedId = id;
  }
  CreateRow(){
    let _RoleID= localStorage.getItem('_RoleID') ; 

    if (Number(_RoleID) > 0)
    {
    this.getPageList(Number(_RoleID) );
    this.getRightList(Number(_RoleID) );
    this.AddRoleForm.controls['roleName'].setValue(localStorage.getItem('_RoleName'));
    this.AddRoleForm.controls['remarks'].setValue(localStorage.getItem('_RoleRemark'));  

    }
    else 
    {
    this.getPageList(0);
    this.getRightList(0); 

    }
    this.modalopen = true;
    this.createmodalopen  = true;
  }
  editRow(){
    this.modalopen = true;
    this.editmodalopen  = true;
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
  deleteRow(roleId,roleName){
    console.log("roleId:"+roleId);
    console.log("rolename:"+roleName);
    const message = `Are you sure you want delete this Role: `+roleName+`?`;
    const dialogData = new ConfirmDialogModel("Confirm Deletion", message, 'Delete', 'Cancel');

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      maxWidth: "0",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if(dialogResult) {
        this.deleteRole(roleId);
      } else {
      }
    });
    
  }
  getPageList(TID:number) {  
    
    this._userManagementService.getAllPages(TID).subscribe((data: {}) => {  

    console.log("Page List",data);
    this._PageList = data;
    this._PageList.forEach(item => {
    if(item.parent_id == 0) {
    item.subItem = []
    let fg = this.__formBuilder.group({
    page_name: [item.page_name],
    isChecked: [item.isChecked],
    subItems: this.__formBuilder.array([]),
    id: [item.id],
    parent_id: [item.parent_id]
    })
    this.roles.push(fg)
    }
    }) 

    this._PageList.forEach(item => {
    if(item.parent_id && item.parent_id != 0) {
    let found = this.roles.controls.find(ctrl=> ctrl.get('id').value == item.parent_id)
    if(found) { 
    let fg = this.__formBuilder.group({
    page_name: [item.page_name],
    isChecked: [item.isChecked],
    subItems: [[]],
    id: [item.id],
    parent_id: [item.parent_id]
    })
    let subItems = found.get('subItems') as FormArray
    subItems.push(fg)
    }
    }
    })
    });
    }

    getRightList(TID:number) {  
    
    this._userManagementService.getAllRights(TID).subscribe((data: {}) => { 

    this._RightList = data;  
    this._RightList.forEach(item => {
    let fg = this.__formBuilder.group({
    page_right: [item.page_right],
    isChecked: [item.isChecked], 
    id: [item.id],          
    })
    this._PageRight.push(fg)
    })      

    });
    }

    onSubmit() {

      this.submitted = true;   
      console.log('SubmitingForm',this.AddRoleForm);

      this._PageIDAndChk ="";
      for (let i = 0; i < this.AddRoleForm.value.Roles.length; i++) {

      this._PageIDAndChk += this.AddRoleForm.value.Roles[i].id +','+  this.AddRoleForm.value.Roles[i].isChecked +'#'
      
      if (this.AddRoleForm.value.Roles[i].subItems.length > 0)
      {
      for (let j = 0; j < this.AddRoleForm.value.Roles[i].subItems.length; j++) {
      this._PageIDAndChk += this.AddRoleForm.value.Roles[i].subItems[j].id +','+  this.AddRoleForm.value.Roles[i].subItems[j].isChecked +'#'
      
      }           
      }       

      }
      let __pageRights="";
      for (let i = 0; i < this.AddRoleForm.value._PageRight.length; i++) {             

      if (this.AddRoleForm.value._PageRight[i].isChecked)
      { 
      __pageRights += String(this.AddRoleForm.value._PageRight[i].id)   +','  
      }      

      }  
      this.AddRoleForm.patchValue({      
      CreatedBy:1,      
      User_Token: localStorage.getItem('User_Token'),
      _PageIDAndChk: this._PageIDAndChk,
      pageRights:__pageRights
      });

      const rights = this.AddRoleForm.value._PageRight;
      this._userManagementService.saveRoleInfo(this.AddRoleForm.value)
      .subscribe( data => {
        this._toasterService.showToaster('User created succesfully', 'success')
        this.OnReset();
        setTimeout(() => {
          this._userManagementService.roleChanged();
        }, 50);
        // Update local storage with rights
        rights.forEach(element => {
          localStorage.setItem(element.page_right, element.isChecked);
        });
      });

      localStorage.removeItem('_RoleID');   
      localStorage.removeItem('roleName');   
      localStorage.removeItem('remarks');
      window.location.reload();

      }


    onCheckChild(role) {
      setTimeout(()=> {
        let oneFalseFound = role
        .get("subItems")
        .controls.every((r) => r.get("isChecked").value == true);
      oneFalseFound
        ? role.patchValue({ isChecked: true })
        : role.patchValue({ isChecked: false });
      }, 100);
    }
  
    onCheckParent(role: any) {
      let _bool = role.get("isChecked").value;
      if (_bool) {
        role.get("subItems").controls.forEach((elm) => {
          elm.patchValue({ isChecked: false });
        });
      } else {
        role.get("subItems").controls.forEach((elm) => {
          elm.patchValue({ isChecked: true });
        });
      }
    }
  
    OnSelectAll() {
      let _bool = this.AddRoleForm.controls["SelectAll"].value; 
      this.roles.controls.forEach((role) => {
        role.patchValue({ isChecked: _bool });
        let subItems = role.get("subItems") as FormArray;
        subItems.controls.forEach((elm) => {
          elm.patchValue({ isChecked: _bool });
        });
      });
    }
  
    OnSelectRightAll() {
      let _bool = this.AddRoleForm.controls["SelectAllRights"].value; 
      this._PageRight.controls.forEach((role) => {
        role.patchValue({ isChecked: _bool });
        
      });
    }


    OnReset() { 
    this.AddRoleForm.controls['roleName'].setValue("");
    this.AddRoleForm.controls['remarks'].setValue("");  

    let _bool = false; 
    this.roles.controls.forEach((role) => {
      role.patchValue({ isChecked: _bool });
      let subItems = role.get("subItems") as FormArray;
      subItems.controls.forEach((elm) => {
        elm.patchValue({ isChecked: _bool });
      });
    });
    _bool = this.AddRoleForm.controls["SelectAllRights"].value; 
    this._PageRight.controls.forEach((role) => {
      role.patchValue({ isChecked: false });
    });


    }

    OnBack()
    {
    localStorage.removeItem('_RoleID') ;   
    localStorage.removeItem('roleName') ;   
    localStorage.removeItem('remarks') ;
    window.location.reload();

    }

    deleteRole(roleId:any){
      let data = {
      "id":roleId
      };
      this._userManagementService.deleteRolesData(data).subscribe(data => {
        this._toasterService.showToaster(data, 'success');
        this.openlist = false;
        this.createmodalopen = false;
        this.geRoleList();
      });   
    }
}
