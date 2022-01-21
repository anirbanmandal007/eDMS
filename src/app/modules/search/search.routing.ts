import { Route } from '@angular/router';
import { AdvancedSearchComponent } from './advanced-search/advanced-search.component';
import { BulkDownloadComponent } from './bulk-download/bulk-download.component';
import { ContentSearchComponent } from './content-search/content-search.component';
import { DeleteFilesComponent } from './delete-files/delete-files.component';
import { FileStorageComponent } from './file-storage/file-storage.component';


export const searchRoutes: Route[] = [
    {
        path     : '',
        children: [
            {path: 'content-search', component: ContentSearchComponent},
            {path: 'advanced-search', component: AdvancedSearchComponent},
            {path: 'file-storage', component: FileStorageComponent},
            {path: 'bulk-download', component: BulkDownloadComponent},
            {path: 'delete-files', component: DeleteFilesComponent},
        ]
    }
];
