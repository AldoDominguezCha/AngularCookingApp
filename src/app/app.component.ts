import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { AppState } from './shared/store/app-state.interface';
import { AutoLogin } from './shared/store/actions/auth.generators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(new AutoLogin());
  }

}
