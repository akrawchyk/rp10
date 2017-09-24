import { Component } from '@angular/core'

import { Rp10 } from './rp10'

@Component({
  selector: 'app-root',
  template: `
    <md-toolbar color="primary">
      <span class="logo"><img class="logo-img" src="/assets/images/strive-logo.png" alt="Strive Swim logo"></span>
      <span>RP10</span>
    </md-toolbar>
    <div class="wrap">
      <div class="left-side">
        <app-form (update)="setRp10($event)"></app-form>
        <app-seconds-pro-exporter *ngIf="rp10" [rp10]="rp10"></app-seconds-pro-exporter>
      </div>
      <div class="right-side">
        <app-practice-groups *ngIf="rp10" [rp10]="rp10"></app-practice-groups>
      </div>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  rp10: Rp10

  setRp10(rp10: Rp10) {
    this.rp10 = rp10
  }
}
