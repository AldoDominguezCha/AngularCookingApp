import { exhaustMap, map, take } from 'rxjs';
import { Injectable } from "@angular/core";
import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: 'root' })
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.userSubject.pipe(take(1), exhaustMap(user => {
      if (!user) return next.handle(req);

      const authorizedRequest = req.clone({ params: new HttpParams().set('auth', user?.token) })
      return next.handle(authorizedRequest);
    }));
  }
}
