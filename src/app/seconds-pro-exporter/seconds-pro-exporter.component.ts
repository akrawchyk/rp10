import { Component, Input, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import * as mailcheck from 'mailcheck'

import { EmailExportService } from '../email-export.service'
import { Rp10, formatDurationDisplay } from '../rp10'

@Component({
  selector: 'app-seconds-pro-exporter',
  template: `
    <form class="form" [formGroup]="form" novalidate>
      <md-input-container>
        <input mdInput formControlName="email" type="email" id="email" placeholder="enter email">
      </md-input-container>
      <label *ngIf="mailcheckSuggestion" for="email" (click)="setEmailToSuggestion()">
        Suggested: {{mailcheckSuggestion}}
      </label>
      <button md-raised-button (click)="onClick()" color="accent" type="button" [disabled]="loading || !form.valid">
        <span class="material-icons">get_app</span> Export to .seconds
      </button>
      <p class="message message--error" *ngIf="errorMessage">{{errorMessage}}</p>
      <p class="message message--success" *ngIf="successMessage">{{successMessage}}</p>
    </form>
  `,
  styleUrls: ['./seconds-pro-exporter.component.scss'],
})
export class SecondsProExporterComponent implements OnInit {
  @Input() rp10: Rp10

  errorMessage: string = ''
  successMessage: string = ''
  mailcheckSuggestion: string = ''
  loading: boolean = false
  form: FormGroup

  constructor(
    private emailExportService: EmailExportService,
    private fb: FormBuilder
  ) {
    this.form = fb.group({
      email: ['', Validators.email],
    })
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(form => this.update())
  }

  onClick() {
    this.loading = true
    this.errorMessage = ''
    this.successMessage = ''

    // export rp10 -> .seconds -> POST
    const secondsFormat = this.rp10.toSecondsProFormat().map(secondsFormat => {
      const name = secondsFormat.name.split(' ').join('_')
      return {
        name: `${name}_RP10_export.seconds`,
        seconds: secondsFormat,
      }
    })

    const body = {
      emailAddress: this.form.value.email,
      // XXX
      emailIntro: `All groups: ${this.rp10.repCount}x${this.rp10
        .todaysRepeats} (${this.rp10.restPerRepeat}s rest at ${this.rp10
        .percentGoalPaceToTrainToday})`,
      emailBody: this.rp10.goalTimes
        .map((goalTime, idx) => {
          const name = goalTime.name || `Group ${idx + 1}`
          const target = this.rp10.getTargetForGoalTime(goalTime)
          const interval = this.rp10.getIntervalForGoalTime(goalTime)
          const totalSetTime = interval * this.rp10.repCount
          const goalPoolType = this.rp10.myGoalTimeIsFor[
            this.rp10.myGoalTimeIsFor.length - 1
          ].toLowerCase()

          return `
        ${name}
        Target: ${formatDurationDisplay(target)} - Interval @ ${formatDurationDisplay(interval)}
        Goal time: ${goalTime.distance}${goalPoolType} @ ${formatDurationDisplay(goalTime.duration)}
        Total set time: ${formatDurationDisplay(totalSetTime)}
        `
        })
        .join('\n'),
      // XXX
      data: JSON.stringify(secondsFormat),
    }

    console.log(body)

    this.emailExportService
      .newEmail(body)
      .then(res => {
        this.errorMessage = ''
        this.successMessage = res.message
        this.loading = false
      })
      .catch(err => {
        this.errorMessage = err.statusText
        this.successMessage = ''
        this.loading = false
      })
  }

  update() {
    this.errorMessage = ''
    this.successMessage = ''

    mailcheck.run({
      topLevelDomains: ['com', 'net', 'org', 'edu'],
      email: this.form.value.email,
      suggested: suggestion => {
        this.mailcheckSuggestion = suggestion.full
      },
      empty: () => {
        this.mailcheckSuggestion = ''
      },
    })
  }

  setEmailToSuggestion() {
    this.form.patchValue({ email: this.mailcheckSuggestion })
    this.update()
  }
}
