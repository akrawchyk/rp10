import { Component } from '@angular/core'

import { Rp10 } from './rp10'

@Component({
  selector: 'app-root',
  template: `
    <md-toolbar color="primary">
      <span class="logo"><img class="logo-img" src="/assets/strive-logo.png"></span>
      <span>RP10</span>
    </md-toolbar>
    <div class="wrap">
      <app-form class="left-side" (update)="setRp10($event)"></app-form>
      <app-practice-groups class="right-side" *ngIf="rp10" [rp10]="rp10"></app-practice-groups>
    </div>
  `,
  styles: []
})
export class AppComponent {
  rp10: Rp10

  setRp10(rp10: Rp10) {
    this.rp10 = rp10
  }
}
