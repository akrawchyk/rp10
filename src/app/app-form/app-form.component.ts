import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { Rp10, GoalTime } from '../rp10'

@Component({
  selector: 'app-form',
  templateUrl: './app-form.component.html',
  styleUrls: ['./app-form.component.scss'],
})
export class AppFormComponent implements OnInit {
  rp10: Rp10

  @Output('update') change: EventEmitter<Rp10> = new EventEmitter<Rp10>()

  repeatChoices: number[] = [25, 50, 75, 100, 125, 150, 175, 200, 225, 250]
  poolLengthChoices: string[] = ['SCY', 'SCM', 'LCM']
  intervalChoices: number[] = []

  // TODO debouce/throttle inputs
  form: FormGroup

  constructor(private fb: FormBuilder) {
    const initialGoalTimes = [
      new GoalTime('1:42.0', 200, 'John G'),
      new GoalTime('53.7', 100),
      new GoalTime('23.41', 50),
      new GoalTime('5:00', 500),
      new GoalTime('4:08.02', 500),
      new GoalTime('4:19:33.09', 25000),
      new GoalTime('26', 50),
      new GoalTime('33', 50),
      new GoalTime('36', 50),
    ]

    this.form = fb.group({
      todaysRepeats: [50, Validators.required],
      repCount: [20, Validators.required],
      goalPlusMinus: [0, Validators.required],
      myGoalTimeIsFor: ['SCY', Validators.required],
      todayMyTrainingPoolIs: ['SCM', Validators.required],
      percentGoalPaceToTrainToday: [100, Validators.required],
      restPerRepeat: [25, Validators.required],
      sameInterval: null,
      // use text representation for textarea input
      goalTimes: [
        initialGoalTimes.map(goalTime => goalTime.toString()).join('\n'),
        Validators.required,
      ],
    })

    this.form.valueChanges.subscribe(form => this.update())
  }

  ngOnInit(): void {
    this.update()
  }

  update(): void {
    if (!this.form.valid) {
      this.rp10 = null
      this.intervalChoices = []
    } else {
      let {
        todaysRepeats,
        repCount,
        goalPlusMinus,
        myGoalTimeIsFor,
        todayMyTrainingPoolIs,
        percentGoalPaceToTrainToday,
        restPerRepeat,
        goalTimes,
        sameInterval,
      } = this.form.value

      if (this.rp10 && this.rp10.sameInterval === sameInterval) {
        // inputs changed so prepare for new interval choices
        sameInterval = null
        this.form.patchValue({ sameInterval })
      }

      // transform goal times from string
      goalTimes = goalTimes
        .split('\n')
        .filter(line => line.trim())
        .map(GoalTime.fromString),

      this.rp10 = new Rp10(
        todaysRepeats,
        repCount,
        goalPlusMinus,
        myGoalTimeIsFor,
        todayMyTrainingPoolIs,
        percentGoalPaceToTrainToday,
        restPerRepeat,
        goalTimes,
        +sameInterval // XXX: +null === 0
      )

      if (!this.rp10.sameInterval) {
        // slowest interval changed so need to present new interval choices
        this.updateIntervalChoices()
      }
    }

    this.change.emit(this.rp10)
  }

  private updateIntervalChoices(): void {
    // find the slowest pace
    const slowestInterval = this.rp10.goalTimes
      .map(goalTime => this.rp10.getIntervalForGoalTime(goalTime))
      .reduce((slowest, interval) => {
        return interval > slowest ? interval : slowest
      }, 0)

    // generate n intervals 5 seconds apart
    const intervals = []
    for (let i = 0; i < 25; i++) {
      intervals.push(slowestInterval + i * 5)
    }
    this.intervalChoices = intervals
  }
}
