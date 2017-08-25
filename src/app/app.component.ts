import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  template: `
    <md-toolbar color="primary">
      <span class="logo"><img class="logo-img" src="/assets/strive-logo.png"></span>
      <span>RP10</span>
    </md-toolbar>
    <div class="wrap">
      <md-card>
        <app-form></app-form>
      </md-card>
    </div>
  `,
  styles: []
})
export class AppComponent {
}
