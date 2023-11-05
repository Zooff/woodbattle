import { Route } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { ResourceResolver } from './service/resource-resolver.service';

export const appRoutes: Route[] = [
    {path: '**', component: HomeComponent, resolve: {resource: ResourceResolver}}
];
