import { exhaustMap, map, take } from 'rxjs';
import { Injectable } from "@angular/core";
import { Store } from '@ngrx/store';
import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";

import { AppState } from '../shared/store/app-state.interface';
import { AuthState } from '../shared/store/reducers/auth.reducer';

@Injectable({ providedIn: 'root' })
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private store: Store<AppState>) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.store.select('auth')
      .pipe(
        take(1),
        map((authState: AuthState) => authState.user),
        exhaustMap(user => {
        if (!user) return next.handle(req);

        const authorizedRequest = req.clone({ params: new HttpParams().set('auth', user?.token) })
        return next.handle(authorizedRequest);
        })
      );
  }
}
