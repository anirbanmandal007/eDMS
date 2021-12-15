import { Component, OnInit } from '@angular/core';
import { UserManagementService } from '../user-management.service';
@Component({
  selector: 'app-role-management',
  templateUrl: './role-management.component.html',
  styleUrls: ['./role-management.component.scss']
})
export class RoleManagementComponent implements OnInit {
  dataSource: any;
  displayTable: boolean;
  dtOptions: any;
  selectedId: any;

  constructor(private _userManagementService: UserManagementService) { }

  ngOnInit(): void {
    this.geRoleList();
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
  CreateRow(){}
}
