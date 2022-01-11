/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

// ['Dashboard', 'User Management', 'Master', 'Upload', 'Add User', 'Process', 'Log Report', 'File Upload', 
// 'File Storage', 'Tagging', 'CSV Upload', 'Search', 'Report', 'Status Report', 'Document Type', 'Customer', 
// 'Customer Mapping', 'Add Role', 'Custom Forms', 'Data Entry', 'Quick Search', 'Region', 'Meta Data Report', 
// 'Database Log', 'Document Type Mapping', 'Template', 'Advanced Search', 'Userdashboard', 'Template Mapping', 
// 'BulkDownlaod', 'Template Configuration', 'DocumentStatus', 'ASearch', 'DeleteFiles', 'Sftp Upload', 
// 'Region Mapping', 'Change Password']

export const defaultNavigation: FuseNavigationItem[] = [
    // {
    //     id   : 'example',
    //     title: 'Example',
    //     type : 'basic',
    //     icon : 'heroicons_outline:chart-pie',
    //     link : '/example'
    // },
    {
        id   : 'Dashboard',
        title: 'Dashboard',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dashboard',
        disabled: false
    },
    {
        id   : 'User Management',
        title: 'User Management',
        type : 'aside',
        icon : 'heroicons_outline:user-group',
        disabled: false,
        children: [
            {
                id   : 'Add User',
                title: 'Users',
                type : 'basic',
                icon : 'heroicons_outline:users',
                link : '/userManagement/user',
                disabled: false,
            },
            {
                id   : 'Add Role',
                title: 'Roles',
                type : 'basic',
                icon : 'heroicons_outline:user',
                link : '/userManagement/roles',
                disabled: false,
            },
            {
                id   : 'Change Password',
                title: 'Change Password',
                type : 'basic',
                icon : 'heroicons_outline:pencil-alt',
                link : '/userManagement/change-password',
                disabled: false,
            }
        ]
    },
    {
        id   : 'Master',
        title: 'Master',
        type : 'aside',
        icon : 'heroicons_outline:cog',
        disabled: false,
        children: [
            {
                id   : 'Template',
                title: 'Template',
                type : 'basic',
                icon : 'heroicons_outline:template',
                link : '/master/template',
                disabled: false,
            },
            {
                id   : 'Customer',
                title: 'Customer',
                type : 'basic',
                icon : 'heroicons_outline:user',
                link : '/master/Customer',
                disabled: false,
            },
            {
                id   : 'Customer Mapping',
                title: 'Customer Mapping',
                type : 'basic',
                icon : 'heroicons_outline:map',
                link : '/master/customer-mapping',
                disabled: false,
            },
            {
                id   : 'Custom Forms',
                title: 'View Custom Form',
                type : 'basic',
                icon : 'heroicons_outline:archive',
                link : '/master/view-custom-form',
                disabled: false,
            },
            {
                id   : 'Region',
                title: 'Region',
                type : 'basic',
                icon : 'heroicons_outline:globe-alt',
                link : '/master/Region',
                disabled: false,
            },
            {
                id   : 'Template Mapping',
                title: 'Template Mapping',
                type : 'basic',
                icon : 'heroicons_outline:template',
                link : '/master/template-mapping',
                disabled: false,
            },
            {
                id   : 'Region Mapping',
                title: 'Region Mapping',
                type : 'basic',
                icon : 'heroicons_outline:location-marker',
                link : '/master/region-mapping',
                disabled: false,
            }
        ]
    },
    {
        id   : 'Report',
        title: 'Reports',
        type : 'aside',
        icon : 'heroicons_outline:document-report',
        disabled: false,
        children: [
            {
                id   : 'Log Report',
                title: 'Logs',
                type : 'basic',
                icon : 'heroicons_outline:server',
                link : '/reports/logs',
                disabled: false,
            },
            {
                id   : 'Status Report',
                title: 'Status',
                type : 'basic',
                icon : 'heroicons_outline:status-online',
                link : '/reports/status',
                disabled: false,
            },
            {
                id   : 'Meta Data Report',
                title: 'Metadata',
                type : 'basic',
                icon : 'heroicons_outline:document-duplicate',
                link : '/reports/metadata',
                disabled: false,
            }
        ]
    },
    {
        id   : 'Process',
        title: 'Process',
        type : 'aside',
        icon : 'heroicons_outline:database',
        disabled: false,
        children: [
            {
                id   : 'Data Entry',
                title: 'Indexing',
                type : 'basic',
                icon : 'heroicons_outline:document-text',
                link : '/process/indexing',
                disabled: false,
            }
        ]
    },
    {
        id   : 'Search',
        title: 'Search',
        type : 'aside',
        icon : 'heroicons_outline:search',
        disabled: false,
        children: [
            {
                id   : 'Quick Search',
                title: 'Content Search',
                type : 'basic',
                icon : 'heroicons_outline:document-search',
                link : '/search/content-search',
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
        id   : 'Dashboard',
        title: 'Dashboard',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/dashboard',
        disabled: false
    },
    {
        id   : 'User Management',
        title: 'User Management',
        type : 'aside',
        icon : 'heroicons_outline:user-group',
        disabled: false,
        children: [
            {
                id   : 'Add User',
                title: 'Users',
                type : 'basic',
                icon : 'heroicons_outline:users',
                link : '/userManagement/user',
                disabled: false,
            },
            {
                id   : 'Add Role',
                title: 'Roles',
                type : 'basic',
                icon : 'heroicons_outline:user',
                link : '/userManagement/roles',
                disabled: false,
            },
            {
                id   : 'Change Password',
                title: 'Change Password',
                type : 'basic',
                icon : 'heroicons_outline:pencil-alt',
                link : '/userManagement/change-password',
                disabled: false,
            }
        ]
    },
    {
        id   : 'Master',
        title: 'Master',
        type : 'aside',
        icon : 'heroicons_outline:cog',
        disabled: false,
        children: [
            {
                id   : 'Template',
                title: 'Template',
                type : 'basic',
                icon : 'heroicons_outline:template',
                link : '/master/template',
                disabled: false,
            },
            {
                id   : 'Customer',
                title: 'Customer',
                type : 'basic',
                icon : 'heroicons_outline:user',
                link : '/master/Customer',
                disabled: false,
            },
            {
                id   : 'Customer Mapping',
                title: 'Customer Mapping',
                type : 'basic',
                icon : 'heroicons_outline:map',
                link : '/master/customer-mapping',
                disabled: false,
            },
            {
                id   : 'Custom Forms',
                title: 'View Custom Form',
                type : 'basic',
                icon : 'heroicons_outline:archive',
                link : '/master/view-custom-form',
                disabled: false,
            },
            {
                id   : 'Region',
                title: 'Region',
                type : 'basic',
                icon : 'heroicons_outline:globe-alt',
                link : '/master/Region',
                disabled: false,
            },
            {
                id   : 'Template Mapping',
                title: 'Template Mapping',
                type : 'basic',
                icon : 'heroicons_outline:template',
                link : '/master/template-mapping',
                disabled: false,
            },
            {
                id   : 'Region Mapping',
                title: 'Region Mapping',
                type : 'basic',
                icon : 'heroicons_outline:location-marker',
                link : '/master/region-mapping',
                disabled: false,
            }
        ]
    },
    {
        id   : 'Report',
        title: 'Reports',
        type : 'aside',
        icon : 'heroicons_outline:document-report',
        disabled: false,
        children: [
            {
                id   : 'Log Report',
                title: 'Logs',
                type : 'basic',
                icon : 'heroicons_outline:server',
                link : '/reports/logs',
                disabled: false,
            },
            {
                id   : 'Status Report',
                title: 'Status',
                type : 'basic',
                icon : 'heroicons_outline:status-online',
                link : '/reports/status',
                disabled: false,
            },
            {
                id   : 'Meta Data Report',
                title: 'Metadata',
                type : 'basic',
                icon : 'heroicons_outline:document-duplicate',
                link : '/reports/metadata',
                disabled: false,
            }
        ]
    },
    {
        id   : 'Process',
        title: 'Process',
        type : 'aside',
        icon : 'heroicons_outline:database',
        disabled: false,
        children: [
            {
                id   : 'Data Entry',
                title: 'Indexing',
                type : 'basic',
                icon : 'heroicons_outline:document-text',
                link : '/process/indexing',
                disabled: false,
            }
        ]
    },
    {
        id   : 'Search',
        title: 'Search',
        type : 'aside',
        icon : 'heroicons_outline:search',
        disabled: false,
        children: [
            {
                id   : 'Quick Search',
                title: 'Content Search',
                type : 'basic',
                icon : 'heroicons_outline:document-search',
                link : '/search/content-search',
                disabled: false,
            }
        ]
    }
];
