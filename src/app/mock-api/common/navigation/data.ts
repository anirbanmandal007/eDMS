/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    // {
    //     id   : 'example',
    //     title: 'Example',
    //     type : 'basic',
    //     icon : 'heroicons_outline:chart-pie',
    //     link : '/example'
    // },
    {
        id   : 'userManagement',
        title: 'User Management',
        type : 'aside',
        icon : 'heroicons_outline:chart-pie',
        disabled: false,
        children: [
            {
                id   : 'users',
                title: 'Users',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/userManagement/user',
                disabled: false,
            },
            {
                id   : 'roles',
                title: 'Roles',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/userManagement/roles',
                disabled: false,
            },
            {
                id   : 'changePassword',
                title: 'Change Password',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/userManagement/change-password',
                disabled: false,
            }
        ]
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'dashboard',
        title: 'Dashboard',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dashboard',
        disabled: false
    },
    {
        id   : 'userManagement',
        title: 'User Management',
        type : 'aside',
        icon : 'heroicons_outline:chart-pie',
        disabled: false,
    }
];
