import * as moment from 'moment'

import { Component, Input, OnInit, forwardRef } from '@angular/core'
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

import { GoalTime } from '../rp10'

@Component({
  selector: 'app-goal-times',
  template: `
    <md-input-container class="form-control">
      <label>Up to 10 goal times (with distance)</label>
      <textarea #goalTimes mdInput [(ngModel)]="_displayValue" (blur)="onBlur(goalTimes.value)"></textarea>
      <md-error *ngIf="_errorMessage">
        {{_errorMessage}}
      </md-error>
    </md-input-container>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GoalTimesComponent),
      multi: true
    }
  ],
  styleUrls: ['./goal-times.component.scss']
})
export class GoalTimesComponent implements OnInit, ControlValueAccessor {
  constructor() {}

  @Input('value') _value: GoalTime[] = []
  _displayValue: string = ''
  _errorMessage: string = ''

  get value() {
    return this._value
  }

  set value(val: GoalTime[]) {
    this._value = val
    this.propagateChange(this._value)
  }

  propagateChange: any = () => {}

  ngOnInit() {}

  writeValue(val: GoalTime[]) {
    if (val && val.length) {
      this._value = val
      this._displayValue = this._formatDisplayValue(val)
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn
  }

  registerOnTouched() {}

  onBlur(displayVal) {
    this._errorMessage = ''

    try {
      const read = displayVal.split('\n').map(GoalTime.fromString)
      this._value = read
    } catch (err) {
      // FIXME display errors in template
      this._errorMessage = err.message
      console.log(err.message)
    }
  }

  _formatDisplayValue(val: GoalTime[]) {
    return val
      .map(goalTime => {
        return goalTime.toString()
      })
      .join('\n')
  }
}
