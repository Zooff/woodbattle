import { Route } from '@angular/router';
import { GameComponent } from './page/game/game.component';
import { ResourceResolver } from './service/resource-resolver.service';
import { HomeComponent } from './page/home/home.component';

export const appRoutes: Route[] = [
    {path: 'game', component: GameComponent},
    {path: '**', component: HomeComponent, resolve: {resource: ResourceResolver}}
];
