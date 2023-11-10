import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { GameMapService } from "../service/game-map.service";
import { take } from "rxjs";

export const ShopMapResolver: ResolveFn<any>  = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    gameMapService = inject(GameMapService)
) => {
    return gameMapService.getShopMap().pipe(
        take(1)
    )
}