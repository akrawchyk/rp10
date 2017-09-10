import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { EmailExportService } from '../email-export.service'
import { Rp10 } from '../rp10'

@Component({
  selector: 'app-seconds-pro-exporter',
  template: `
    <form class="form" [formGroup]="form" novalidate>
      <md-input-container>
        <input mdInput formControlName="email" type="email" placeholder="enter email">
      </md-input-container>
      <button md-raised-button (click)="onClick()" color="accent" type="button" [disabled]="loading || !form.valid">
        <span class="material-icons">get_app</span> Export to .seconds
      </button>
      <p class="message message--error" *ngIf="errorMessage">{{errorMessage}}</p>
    </form>
  `,
  styleUrls: ['./seconds-pro-exporter.component.scss'],
})
export class SecondsProExporterComponent implements OnInit {
  @Input() rp10: Rp10

  errorMessage: string = ''

  loading: boolean = false

  form: FormGroup

  constructor(
    private emailExportService: EmailExportService,
    private fb: FormBuilder
  ) {
    this.form = fb.group({
      email: ['', Validators.email]
    })
  }

  ngOnInit() {}

  onClick() {
    this.loading = true
    this.errorMessage = ''

    // export rp10 -> .seconds -> POST
    const secondsFormatted = this.rp10
      .toSecondsProFormat()
      .map(secondsFormat => {
        const name = secondsFormat.name.split(' ').join('_')
        return {
          name: `${name}_RP10_export.seconds`,
          seconds: secondsFormat,
        }
      })

    const body = {
      email: this.form.value.email,
      export: secondsFormatted
    }

    this.emailExportService
      .newEmail(body)
      .then(res => {
        console.log(res)
        this.loading = false
      })
      .catch(err => (this.errorMessage = err.message))
  }
}
