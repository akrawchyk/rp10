import { Component, OnInit } from '@angular/core'
import {
  FormBuilder,
  FormGroup
} from '@angular/forms'

import { RP10, GoalTime } from '../rp10'

@Component({
  selector: 'app-form',
  templateUrl: './app-form.component.html',
  styleUrls: ['./app-form.component.scss']
})
export class AppFormComponent {
  repeatChoices = [25, 50, 75, 100, 125, 150, 175, 200, 225, 250]
  poolLengthChoices = ['SCY', 'SCM', 'LCM']

  // model = new RP10(50, 20, 0, 'SCY', 'SCM', 1, 25, [
  // ])

  goalTimes = [
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

  submitted = false

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      todaysRepeats: 0,
      ofReps: 0,
      goalPlusMinus: '',
      myGoalTimeIsFor: '',
      todayMyTrainingPoolIs: '',
      ofGoalPaceToTrainToday: 0,
      secondsRestPerRepeat: 0,
      goalTimes: [this.goalTimes]
    })
  }

  onSubmit() {
    console.log('submitted!')
    this.submitted = true
  }
}
