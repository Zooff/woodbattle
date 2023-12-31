import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from "@angular/router";
import { take } from "rxjs";
import { ResourceService } from "../service/resource.service";

const DEFAULT_RESSOURCE = ['swordman', 'smith']

export const ResourceResolver: ResolveFn<any> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
    resourceService = inject(ResourceService)) => {
    console.log('Resolve')
    return resourceService.loadImg(DEFAULT_RESSOURCE).pipe(
        take(1)
    )
}