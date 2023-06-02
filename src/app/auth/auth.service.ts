import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from '../shared/store/app-state.interface';
import { LogOut } from '../shared/store/actions/auth.generators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenExpirationTimerRef: any = null;


  constructor(
    private store: Store<AppState>
  ) {}

  setLogoutTimer(tokenDurationInMiliseconds : number) {
    this.tokenExpirationTimerRef = setTimeout(() => {
      this.store.dispatch(new LogOut());
    }, tokenDurationInMiliseconds);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimerRef) {
      clearTimeout(this.tokenExpirationTimerRef);
      this.tokenExpirationTimerRef = null;
    }
  }

}
