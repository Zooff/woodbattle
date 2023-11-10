import { LobbyService } from '../service/lobby.service';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';

export const CanActivateGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  if (!inject(LobbyService).hasStarted()) {
    inject(Router).navigate(['/home'])
    return false
  }
  return true
}