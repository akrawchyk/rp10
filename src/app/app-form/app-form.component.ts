import { Component } from '@angular/core';

import { RP10, GoalTime } from './rp10'

// TODO GoalTime component
// TODO add/remove GoalTime(s) to model array
// TODO repopulate GoalTime(s) from storage

@Component({
  selector: 'app-form',
  templateUrl: './app-form.component.html',
  styleUrls: ['./app-form.component.scss']
})
export class AppFormComponent {
  repeatChoices = [ 25, 50, 75, 100, 125, 150, 175, 200, 225, 250 ]
  poolLengthChoices = [ 'SCY', 'SCM', 'LCM' ]

  model = new RP10(50, 20, 0, 'SCY', 'SCM', 1, 25, [
    new GoalTime('1:42.0', 200),
    new GoalTime('53.7', 100),
    new GoalTime('23.41', 50),
    new GoalTime('5:00', 500),
    new GoalTime('4:08.02', 500),
    new GoalTime('26', 50),
    new GoalTime('33', 50),
    new GoalTime('32', 50),
    new GoalTime('32', 50),
    new GoalTime('40', 50),
  ])

  submitted = false

  onSubmit() {
    this.submitted = true
  }

  get diagnostic() {
    return JSON.stringify(this.model)
  }
}
