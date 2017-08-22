import { Component } from '@angular/core'

@Component({
  selector: 'app-root',
  template: `
    <md-toolbar color="primary">
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
