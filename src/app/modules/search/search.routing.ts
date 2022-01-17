import { Route } from '@angular/router';
import { BulkDownloadComponent } from './bulk-download/bulk-download.component';
import { ContentSearchComponent } from './content-search/content-search.component';
import { DeleteFilesComponent } from './delete-files/delete-files.component';


export const searchRoutes: Route[] = [
    {
        path     : '',
        children: [
            {path: 'content-search', component: ContentSearchComponent},
            {path: 'bulk-download', component: BulkDownloadComponent},
            {path: 'delete-files', component: DeleteFilesComponent},
        ]
    }
];
