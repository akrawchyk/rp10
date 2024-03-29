import { Component, Input, OnInit, forwardRef } from '@angular/core'
import {
  FormControl,
  ControlValueAccessor,
  ValidatorFn,
  ValidationErrors,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
} from '@angular/forms'

import { GoalTime } from '../rp10'

function createGoalTimeStringsValidator(): ValidatorFn {
  return function goalTimeStringsValidator(
    control: FormControl
  ): ValidationErrors | null {
    if (control.value && control.value.trim()) {
      let value = control.value.trim()

      try {
        // validate
        value
          .split('\n')
          .filter(line => line.trim())
          .map(GoalTime.fromString)
        return null
      } catch (err) {
        return { formatting: { message: err.message, actualValue: value } }
      }
    }
  }
}

@Component({
  selector: 'app-goal-times',
  template: `
    <md-input-container>
      <textarea mdInput [(ngModel)]="value" rows=10></textarea>
      <md-hint>example: 1:42.0 200 John G</md-hint>
    </md-input-container>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GoalTimesComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => GoalTimesComponent),
      multi: true,
    },
  ],
  styleUrls: ['./goal-times.component.scss'],
})
export class GoalTimesComponent implements OnInit, ControlValueAccessor {
  @Input('value') _value: string = ''

  validateFn: any = () => {}
  propagateChange: any = () => {}

  get value() {
    return this._value
  }

  set value(val: string) {
    this._value = val
    this.propagateChange(this._value)
  }

  ngOnInit() {
    this.validateFn = createGoalTimeStringsValidator()
  }

  writeValue(val: string) {
    if (val && val.length) {
      this.value = val
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn
  }

  registerOnTouched() {}

  validate(control: FormControl) {
    return this.validateFn(control)
  }
}
