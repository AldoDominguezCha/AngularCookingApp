import { map, take } from "rxjs";
import { inject } from "@angular/core";
import { Store } from "@ngrx/store";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";

import { AppState } from "../store/app-state.interface";
import { AuthState } from "../store/reducers/auth.reducer";

export function AuthenticationGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const router = inject(Router);
  const store = inject(Store<AppState>);

  return store.select('auth')
    .pipe(
      take(1),
      map((authState: AuthState) => {
      return !!authState.user ? true : router.createUrlTree(['/', 'auth']);
      })
    );
}
