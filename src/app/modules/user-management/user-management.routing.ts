import { Route } from '@angular/router';
import { UserManagementComponent } from './user-management.component';
import { UserComponent } from './user/user.component';
import { RoleManagementComponent } from "./role-management/role-management.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { ProjectconfigurationComponent } from './Projectconfiguration/Projectconfiguration.component';




export const userManagementRoutes: Route[] = [
    {
        path     : '',
        // redirectTo: 'user',
        // component: UserManagementComponent,
        // pathMatch: 'full',
        children: [
            {path: 'user', component: UserComponent},
            {path: 'roles', component: RoleManagementComponent},
            {path: 'change-password', component: ChangePasswordComponent},
            {path: 'Projectconfiguration', component: ProjectconfigurationComponent},
        ]
    }
];
