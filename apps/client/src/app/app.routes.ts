import { Route } from '@angular/router';
import { HomeComponent } from './page/home/home.component';

export const appRoutes: Route[] = [
    {path: '**', component: HomeComponent}
];
