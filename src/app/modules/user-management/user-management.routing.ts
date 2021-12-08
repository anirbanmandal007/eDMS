import { Route } from '@angular/router';
import { UserManagementComponent } from './user-management.component';
import { UserComponent } from './user/user.component';


export const userManagementRoutes: Route[] = [
    {
        path     : '',
        // redirectTo: 'user',
        // component: UserManagementComponent,
        // pathMatch: 'full',
        children: [
            {path: 'user', component: UserComponent}
        ]
    }
];
