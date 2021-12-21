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
        icon : 'heroicons_outline:user-group',
        disabled: false,
        children: [
            {
                id   : 'users',
                title: 'Users',
                type : 'basic',
                icon : 'heroicons_outline:users',
                link : '/userManagement/user',
                disabled: false,
            },
            {
                id   : 'roles',
                title: 'Roles',
                type : 'basic',
                icon : 'heroicons_outline:user',
                link : '/userManagement/roles',
                disabled: false,
            },
            {
                id   : 'changePassword',
                title: 'Change Password',
                type : 'basic',
                icon : 'heroicons_outline:pencil-alt',
                link : '/userManagement/change-password',
                disabled: false,
            }
        ]
    },
    {
        id   : 'master',
        title: 'Master',
        type : 'aside',
        icon : 'heroicons_outline:cog',
        disabled: false,
        children: [
            {
                id   : 'template',
                title: 'Template',
                type : 'basic',
                icon : 'heroicons_outline:template',
                link : '/master/template',
                disabled: false,
            },
            {
                id   : 'customer',
                title: 'Customer',
                type : 'basic',
                icon : 'heroicons_outline:user',
                link : '/master/Customer',
                disabled: false,
            },
            {
                id   : 'customermapping',
                title: 'Customer Mapping',
                type : 'basic',
                icon : 'heroicons_outline:map',
                link : '/master/customer-mapping',
                disabled: false,
            },
            {
                id   : 'viewcustomform',
                title: 'View Custom Form',
                type : 'basic',
                icon : 'heroicons_outline:archive',
                link : '/master/view-custom-form',
                disabled: false,
            },
            {
                id   : 'region',
                title: 'Region',
                type : 'basic',
                icon : 'heroicons_outline:globe-alt',
                link : '/master/Region',
                disabled: false,
            },
            {
                id   : 'templatemapping',
                title: 'Template Mapping',
                type : 'basic',
                icon : 'heroicons_outline:template',
                link : '/master/template-mapping',
                disabled: false,
            },
            {
                id   : 'regionmapping',
                title: 'Region Mapping',
                type : 'basic',
                icon : 'heroicons_outline:location-marker',
                link : '/master/region-mapping',
                disabled: false,
            }
        ]
    },
    {
        id   : 'reports',
        title: 'Reports',
        type : 'aside',
        icon : 'heroicons_outline:document-report',
        disabled: false,
        children: [
            {
                id   : 'logs',
                title: 'Logs',
                type : 'basic',
                icon : 'heroicons_outline:server',
                link : '/reports/logs',
                disabled: false,
            },
            {
                id   : 'status',
                title: 'Status',
                type : 'basic',
                icon : 'heroicons_outline:status-online',
                link : '/reports/status',
                disabled: false,
            },
            {
                id   : 'metadata',
                title: 'Metadata',
                type : 'basic',
                icon : 'heroicons_outline:document-duplicate',
                link : '/reports/metadata',
                disabled: false,
            }
        ]
    },
    {
        id   : 'process',
        title: 'Process',
        type : 'aside',
        icon : 'heroicons_outline:database',
        disabled: false,
        children: [
            {
                id   : 'indexing',
                title: 'Indexing',
                type : 'basic',
                icon : 'heroicons_outline:document-text',
                link : '/process/indexing',
                disabled: false,
            }
        ]
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    // {
    //     id   : 'example',
    //     title: 'Example',
    //     type : 'basic',
    //     icon : 'heroicons_outline:chart-pie',
    //     link : '/example'
    // }
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
export const futuristicNavigation: FuseNavigationItem[] = [
    // {
    //     id   : 'example',
    //     title: 'Example',
    //     type : 'basic',
    //     icon : 'heroicons_outline:chart-pie',
    //     link : '/example'
    // }
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
        icon : 'heroicons_outline:user-group',
        disabled: false,
    },
    {
        id   : 'master',
        title: 'Master',
        type : 'aside',
        icon : 'heroicons_outline:cog',
        disabled: false,
        children: [
            {
                id   : 'template',
                title: 'Template',
                type : 'basic',
                icon : 'heroicons_outline:template',
                link : '/master/template',
                disabled: false,
            },
            {
                id   : 'customer',
                title: 'Customer',
                type : 'basic',
                icon : 'heroicons_outline:user',
                link : '/master/Customer',
                disabled: false,
            },
            {
                id   : 'customermapping',
                title: 'Customer Mapping',
                type : 'basic',
                icon : 'heroicons_outline:map',
                link : '/master/customer-mapping',
                disabled: false,
            },
            {
                id   : 'viewcustomform',
                title: 'View Custom Form',
                type : 'basic',
                icon : 'heroicons_outline:archive',
                link : '/master/view-custom-form',
                disabled: false,
            },
            {
                id   : 'region',
                title: 'Region',
                type : 'basic',
                icon : 'heroicons_outline:globe-alt',
                link : '/master/Region',
                disabled: false,
            },
            {
                id   : 'templatemapping',
                title: 'Template Mapping',
                type : 'basic',
                icon : 'heroicons_outline:template',
                link : '/master/template-mapping',
                disabled: false,
            },
            {
                id   : 'regionmapping',
                title: 'Region Mapping',
                type : 'basic',
                icon : 'heroicons_outline:location-marker',
                link : '/master/region-mapping',
                disabled: false,
            }
        ]
    },
    {
        id   : 'reports',
        title: 'Reports',
        type : 'aside',
        icon : 'heroicons_outline:document-report',
        disabled: false,
        children: [
            {
                id   : 'logs',
                title: 'Logs',
                type : 'basic',
                icon : 'heroicons_outline:server',
                link : '/reports/logs',
                disabled: false,
            },
            {
                id   : 'status',
                title: 'Status',
                type : 'basic',
                icon : 'heroicons_outline:status-online',
                link : '/reports/status',
                disabled: false,
            },
            {
                id   : 'metadata',
                title: 'Metadata',
                type : 'basic',
                icon : 'heroicons_outline:document-duplicate',
                link : '/reports/metadata',
                disabled: false,
            }
        ]
    },
    {
        id   : 'process',
        title: 'Process',
        type : 'aside',
        icon : 'heroicons_outline:database',
        disabled: false,
        children: [
            {
                id   : 'indexing',
                title: 'Indexing',
                type : 'basic',
                icon : 'heroicons_outline:document-text',
                link : '/process/indexing',
                disabled: false,
            }
        ]
    }
];
