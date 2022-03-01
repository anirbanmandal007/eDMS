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
                title: 'Roles Access',
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
            },
            {
                id   : 'Projectconfiguration',
                title: 'Project Configuration',
                type : 'basic',
                icon : 'heroicons_outline:pencil-alt',
                link : '/userManagement/Projectconfiguration',
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
                title: 'Category',
                type : 'basic',
                icon : 'heroicons_outline:template',
                link : '/master/template',
                disabled: false,
            },
            {
                id   : 'Customer',
                title: 'Folder',
                type : 'basic',
                icon : 'heroicons_outline:user',
                link : '/master/Customer',
                disabled: false,
            },
            {
                id   : 'Customer Mapping',
                title: 'Folder Access',
                type : 'basic',
                icon : 'heroicons_outline:map',
                link : '/master/customer-mapping',
                disabled: false,
            },
            {
                id   : 'Custom Forms',
                title: 'Form Entry',
                type : 'basic',
                icon : 'heroicons_outline:archive',
                link : '/master/view-custom-form',
                disabled: false,
            },
            {
                id   : 'Region',
                title: 'Cabinet',
                type : 'basic',
                icon : 'heroicons_outline:globe-alt',
                link : '/master/Region',
                disabled: false,
            },
            {
                id   : 'Template Mapping',
                title: 'Category Access',
                type : 'basic',
                icon : 'heroicons_outline:template',
                link : '/master/template-mapping',
                disabled: false,
            },
            {
                id   : 'Region Mapping',
                title: 'Cabinet Mapping',
                type : 'basic',
                icon : 'heroicons_outline:location-marker',
                link : '/master/region-mapping',
                disabled: false,
            }
        ]
    },
    {
        id   : 'Upload',
        title: 'Upload',
        type : 'aside',
        icon : 'heroicons_outline:upload',
        disabled: false,
        children: [
            {
                id   : 'File Upload',
                title: 'Files Upload',
                type : 'basic',
                icon : 'heroicons_outline:cloud-upload',
                link : '/upload/file-upload',
                disabled: false,
            },
            {
                id   : 'CSV Upload',
                title: 'Data Upload',
                type : 'basic',
                icon : 'heroicons_outline:upload',
                link : '/upload/data-upload',
                disabled: false,
            },
            // {
            //     id   : 'SFTP Upload',
            //     title: 'SFTP Upload',
            //     type : 'basic',
            //     icon : 'heroicons_outline:upload',
            //     link : '/upload/sftpupload',
            //     disabled: false,
            // }
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
                title: 'Activity Report',
                type : 'basic',
                icon : 'heroicons_outline:server',
                link : '/reports/logs',
                disabled: false,
            },
            {
                id   : 'Status Report',
                title: 'File Status',
                type : 'basic',
                icon : 'heroicons_outline:status-online',
                link : '/reports/status',
                disabled: false,
            },
            {
                id   : 'Meta Data Report',
                title: 'Master',
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
                title: 'Data Entry',
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
                title: 'Filter Search',
                type : 'basic',
                icon : 'heroicons_outline:document-search',
                link : '/search/content-search',
                disabled: false,
            },
            {
                id   : 'Advanced Search',
                title: 'keyword-search',
                type : 'basic',
                icon : 'heroicons_outline:search-circle',
                link : '/search/keyword-search',
                disabled: false,
            },
            {
                id   : 'File Storage',
                title: 'Folder Struture',
                type : 'basic',
                icon : 'heroicons_outline:database',
                link : '/search/file-storage',
                disabled: false,
            },
            {
                id   : 'BulkDownlaod',
                title: 'Files Downlaod',
                type : 'basic',
                icon : 'heroicons_outline:cloud-download',
                link : '/search/bulk-download',
                disabled: false,
            },
            {
                id   : 'DeleteFiles',
                title: 'Delete Data',
                type : 'basic',
                icon : 'heroicons_outline:trash',
                link : '/search/delete-files',
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
        title: 'User',
        type : 'aside',
        icon : 'heroicons_outline:user-group',
        disabled: false,
        children: [
            {
                id   : 'Add User',
                title: 'Users Creation',
                type : 'basic',
                icon : 'heroicons_outline:users',
                link : '/userManagement/user',
                disabled: false,
            },
            {
                id   : 'Add Role',
                title: 'Role Access',
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
            ,
            {
                id   : 'Projectconfiguration',
                title: 'Project Configuration',
                type : 'basic',
                icon : 'heroicons_outline:pencil-alt',
                link : '/userManagement/Projectconfiguration',
                disabled: false,
            }
            
        ]
    },
    {
        id   : 'Master',
        title: 'Configuration',
        type : 'aside',
        icon : 'heroicons_outline:cog',
        disabled: false,
        children: [
            {
                id   : 'Template',
                title: 'Category',
                type : 'basic',
                icon : 'heroicons_outline:template',
                link : '/master/template',
                disabled: false,
            },
            {
                id   : 'Customer',
                title: 'Folder',
                type : 'basic',
                icon : 'heroicons_outline:user',
                link : '/master/Customer',
                disabled: false,
            },
            {
                id   : 'Customer Mapping',
                title: 'Folder Access',
                type : 'basic',
                icon : 'heroicons_outline:map',
                link : '/master/customer-mapping',
                disabled: false,
            },
            {
                id   : 'Custom Forms',
                title: 'Form Entry',
                type : 'basic',
                icon : 'heroicons_outline:archive',
                link : '/master/view-custom-form',
                disabled: false,
            },
            {
                id   : 'Region',
                title: 'Cabinet',
                type : 'basic',
                icon : 'heroicons_outline:globe-alt',
                link : '/master/Region',
                disabled: false,
            },
            {
                id   : 'Template Mapping',
                title: 'Catrgory Access',
                type : 'basic',
                icon : 'heroicons_outline:template',
                link : '/master/template-mapping',
                disabled: false,
            },
            {
                id   : 'Region Mapping',
                title: 'Cabinet Access',
                type : 'basic',
                icon : 'heroicons_outline:location-marker',
                link : '/master/region-mapping',
                disabled: false,
            }
        ]
    },
    {
        id   : 'Upload',
        title: 'Upload',
        type : 'aside',
        icon : 'heroicons_outline:upload',
        disabled: false,
        children: [
            {
                id   : 'File Upload',
                title: 'File Upload',
                type : 'basic',
                icon : 'heroicons_outline:cloud-upload',
                link : '/upload/file-upload',
                disabled: false,
            },
            {
                id   : 'CSV Upload',
                title: 'Data Upload',
                type : 'basic',
                icon : 'heroicons_outline:upload',
                link : '/upload/data-upload',
                disabled: false,
            },
            // {
            //     id   : 'SFTP Upload',
            //     title: 'SFTP Upload',
            //     type : 'basic',
            //     icon : 'heroicons_outline:upload',
            //     link : '/upload/sftpupload',
            //     disabled: false,
            // }
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
                title: 'Activity Report',
                type : 'basic',
                icon : 'heroicons_outline:server',
                link : '/reports/logs',
                disabled: false,
            },
            {
                id   : 'Status Report',
                title: 'File Status',
                type : 'basic',
                icon : 'heroicons_outline:status-online',
                link : '/reports/status',
                disabled: false,
            },
            {
                id   : 'Meta Data Report',
                title: 'Master Report',
                type : 'basic',
                icon : 'heroicons_outline:document-duplicate',
                link : '/reports/metadata',
                disabled: false,
            }
        ]
    },
    {
        id   : 'Process',
        title: 'Transaction',
        type : 'aside',
        icon : 'heroicons_outline:database',
        disabled: false,
        children: [
            {
                id   : 'Data Entry',
                title: 'Data Entry',
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
                title: 'Filter Search',
                type : 'basic',
                icon : 'heroicons_outline:document-search',
                link : '/search/content-search',
                disabled: false,
            },
            // {
            //     id   : 'Advanced Search',
            //     title: 'Advanced Search',
            //     type : 'basic',
            //     icon : 'heroicons_outline:search-circle',
            //     link : '/search/advanced-search',
            //     disabled: false,
            // },
            {
                id   : 'File Storage',
                title: 'Folder Structure',
                type : 'basic',
                icon : 'heroicons_outline:database',
                link : '/search/file-storage',
                disabled: false,
            },
            {
                id   : 'BulkDownlaod',
                title: 'Files Downlaod',
                type : 'basic',
                icon : 'heroicons_outline:cloud-download',
                link : '/search/bulk-download',
                disabled: false,
            },
            {
                id   : 'DeleteFiles',
                title: 'Delete Data',
                type : 'basic',
                icon : 'heroicons_outline:trash',
                link : '/search/delete-files',
                disabled: false,
            }
        ]
    }
];
