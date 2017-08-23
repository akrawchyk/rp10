import * as moment from 'moment'

import { Component, Input, OnInit, forwardRef } from '@angular/core'
import {
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS
} from '@angular/forms'

import { GoalTime } from '../rp10'

function createGoalTimeStringsValidator() {
  return function goalTimeStringsValidator(control: FormControl) {
    try {
      const read = control.value.split('\n').map(GoalTime.fromString)
      return null
    } catch (e) {
      return { formatting: { value: control.value } }
    }
  }
}

@Component({
  selector: 'app-goal-times',
  template: `
    <md-input-container class="form-control">
      <label>Up to 10 goal times (with distance)</label>
      <textarea mdInput [(ngModel)]="_displayValue" (blur)="onBlur($event)"></textarea>
      <md-error>
        Expected input format to be \`mm:ss:msms\`
      </md-error>
    </md-input-container>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GoalTimesComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GoalTimesComponent),
      multi: true
    }
  ],
  styleUrls: ['./goal-times.component.scss']
})
export class GoalTimesComponent implements OnInit, ControlValueAccessor {
  @Input('value') _value: GoalTime[] = []
  _displayValue: string = ''

  validateFn: Function

  get value() {
    return this._value
  }

  set value(val: GoalTime[]) {
    this._value = val
    this.propagateChange(this._value)
  }

  ngOnInit() {
    this.validateFn = createGoalTimeStringsValidator()
  }

  valiate(control: FormControl) {
    return this.validateFn(control)
  }

  propagateChange: any = () => {}

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

  onBlur(event: any) {
    let displayValue = event.target.value

    if (displayValue && displayValue.trim()) {
      displayValue = displayValue.trim()

      try {
        const read = displayValue.split('\n').map(GoalTime.fromString)
        this.value = read
      } catch (err) {
        // FIXME display errors in template
        console.log(err.message)
      }
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
