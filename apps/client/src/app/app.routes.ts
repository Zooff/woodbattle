import { Route } from '@angular/router';
import { GameComponent } from './page/game/game.component';
import { ResourceResolver } from './resolver/resource-resolver.service';
import { HomeComponent } from './page/home/home.component';
import { ShopMapResolver } from './resolver/shop-map.resolver';
import { CanActivateGuard } from './guard/game.guard';

export const appRoutes: Route[] = [
    {path: 'game', component: GameComponent, resolve: {shopMap: ShopMapResolver}, canActivate: [CanActivateGuard] },
    {path: '**', component: HomeComponent, resolve: {resource: ResourceResolver}}
];
