import { catchError, map, take } from "rxjs";
import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";

export function AuthenticationGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const router = inject(Router);
  return inject(AuthService).userSubject.pipe(take(1),map(user => {
    return !!user ? true : router.createUrlTree(['/', 'auth']);
  }));
}
