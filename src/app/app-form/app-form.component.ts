import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { Rp10, GoalTime } from '../rp10'

@Component({
  selector: 'app-form',
  templateUrl: './app-form.component.html',
  styleUrls: ['./app-form.component.scss']
})
export class AppFormComponent implements OnInit {
  rp10: Rp10

  @Output('update')
  change: EventEmitter<Rp10> = new EventEmitter<Rp10>()

  repeatChoices = [25, 50, 75, 100, 125, 150, 175, 200, 225, 250]
  poolLengthChoices = ['SCY', 'SCM', 'LCM']

  goalTimes: GoalTime[] = [
    new GoalTime('1:42.0', 200, 'John G'),
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

  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      todaysRepeats: [50, Validators.required],
      repCount: [20, Validators.required],
      goalPlusMinus: [0, Validators.required],
      myGoalTimeIsFor: ['SCY', Validators.required],
      todayMyTrainingPoolIs: ['SCM', Validators.required],
      percentGoalPaceToTrainToday: [100, Validators.required],
      restPerRepeatS: [25, Validators.required],
      // use text representation for textarea input
      goalTimes: [
        this.goalTimes.map(goalTime => goalTime.toString()).join('\n'),
        Validators.required
      ]
    })

    this.form.valueChanges.subscribe(form => this.update())
  }

  ngOnInit() {
    this.update()
  }

  update() {
    if (!this.form.valid) {
      this.rp10 = null
    } else {
      let {
        todaysRepeats,
        repCount,
        goalPlusMinus,
        myGoalTimeIsFor,
        todayMyTrainingPoolIs,
        percentGoalPaceToTrainToday,
        restPerRepeatS,
        goalTimes
      } = this.form.value

      this.rp10 = new Rp10(
        todaysRepeats,
        repCount,
        goalPlusMinus,
        myGoalTimeIsFor,
        todayMyTrainingPoolIs,
        percentGoalPaceToTrainToday,
        restPerRepeatS,
        GoalTime.fromStringList(goalTimes.trim())
      )
    }

    this.change.emit(this.rp10)
  }
}
