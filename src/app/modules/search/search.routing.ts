import { Route } from '@angular/router';
import { ContentSearchComponent } from './content-search/content-search.component';


export const searchRoutes: Route[] = [
    {
        path     : '',
        children: [
            {path: 'content-search', component: ContentSearchComponent},
        ]
    }
];
