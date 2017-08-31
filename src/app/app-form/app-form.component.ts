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
  intervalSChoices: number[] = []

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
      restPerRepeatS: [25, Validators.required],
      sameIntervalS: null,
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
    // update interval choices
    if (!this.form.valid) {
      this.rp10 = null
      this.intervalSChoices = []
    } else {
      let {
        todaysRepeats,
        repCount,
        goalPlusMinus,
        myGoalTimeIsFor,
        todayMyTrainingPoolIs,
        percentGoalPaceToTrainToday,
        restPerRepeatS,
        goalTimes,
        sameIntervalS,
      } = this.form.value

      if (this.rp10 && this.rp10.sameIntervalS === sameIntervalS) {
        // inputs changed so prepare for new interval choices
        sameIntervalS = null
        this.form.patchValue({ sameIntervalS })
      }

      this.rp10 = new Rp10(
        todaysRepeats,
        repCount,
        goalPlusMinus,
        myGoalTimeIsFor,
        todayMyTrainingPoolIs,
        percentGoalPaceToTrainToday,
        restPerRepeatS,
        goalTimes
          .trim()
          .split('\n')
          .map(GoalTime.fromString),
        +sameIntervalS
      )

      if (!this.rp10.sameIntervalS) {
        // slowest interval changed so need to present new interval choices
        this.intervalSChoices = (() => {
          // find the slowest pace
          const slowestIntervalS = this.rp10.goalTimes
            .map(goalTime => this.rp10.getPracticePaceForGoalTime(goalTime))
            .reduce((slowestS, pace) => {
              return pace.intervalS > slowestS ? pace.intervalS : slowestS
            }, 0)

          // generate n intervals 5 seconds apart
          const intervals = []
          for (let i = 0; i < 25; i++) {
            intervals.push(slowestIntervalS + i * 5)
          }
          return intervals
        })()
      }
    }

    this.change.emit(this.rp10)
  }
}
