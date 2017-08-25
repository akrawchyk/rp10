import { Component, OnInit } from '@angular/core'
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms'

import { Rp10, GoalTime } from '../rp10'

@Component({
  selector: 'app-form',
  templateUrl: './app-form.component.html',
  styleUrls: ['./app-form.component.scss']
})
export class AppFormComponent {
  repeatChoices = [25, 50, 75, 100, 125, 150, 175, 200, 225, 250]
  poolLengthChoices = ['SCY', 'SCM', 'LCM']

  goalTimes: GoalTime[] = [
    new GoalTime('1:42.0', 200),
    new GoalTime('53.7', 100),
    new GoalTime('23.41', 50),
    new GoalTime('5:00', 500),
    new GoalTime('4:08.02', 500),
    new GoalTime('26', 50),
    new GoalTime('33', 50),
    new GoalTime('32', 50),
    new GoalTime('32', 50),
    new GoalTime('40', 50)
  ]

  form: FormGroup

  rp10: Rp10

  submitted = false

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      todaysRepeats: [50, Validators.required],
      ofReps: [20, Validators.required],
      goalPlusMinus: [-5, Validators.required],
      myGoalTimeIsFor: ['SCY', Validators.required],
      todayMyTrainingPoolIs: ['SCY', Validators.required],
      ofGoalPaceToTrainToday: [50, Validators.required],
      secondsRestPerRepeat: [25, Validators.required],
      // use text representation for textarea input
      goalTimes: [this.goalTimes.map(goalTime => goalTime.toString()).join('\n'), Validators.required]
      // eventGoalTime?: number,
      // goalEventDistance?: number,
      // ofGoalPace?: number
    })
  }

  onSubmit() {
    let {
      todaysRepeats,
      ofReps,
      goalPlusMinus,
      myGoalTimeIsFor,
      todayMyTrainingPoolIs,
      ofGoalPaceToTrainToday,
      secondsRestPerRepeat,
      goalTimes
    } = this.form.value

    goalTimes = GoalTime.fromStringList(goalTimes)
    this.rp10 = new Rp10(todaysRepeats, ofReps, goalPlusMinus, myGoalTimeIsFor, todayMyTrainingPoolIs, ofGoalPaceToTrainToday, secondsRestPerRepeat, goalTimes)
    this.submitted = true
  }
}
