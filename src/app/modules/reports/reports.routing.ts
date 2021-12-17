import { Route } from '@angular/router';
import { LogsComponent } from './logs/logs.component';
import { MetadataComponent } from './metadata/metadata.component';
import { StatusComponent } from './status/status.component';

export const reportRoutes: Route[] = [
    {
        path     : '',
        children: [
            {path: 'logs', component: LogsComponent},
            {path: 'status', component: StatusComponent},
            {path: 'metadata', component: MetadataComponent},
        ]
    }
];
