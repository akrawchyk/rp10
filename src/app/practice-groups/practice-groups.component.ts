import * as moment from 'moment'

import { Component, OnChanges, OnInit, Input } from '@angular/core';

import { Rp10 } from '../rp10'

@Component({
  selector: 'app-practice-groups',
  template: `
    <md-card *ngFor="let group of groups; index as i">
      <md-card-header>
        <md-card-title>
          <h3>Group {{i+1}}</h3>
        </md-card-title>
      </md-card-header>
      <md-card-content>
        <md-list>
          <md-list-item>Target: {{group.targetS | number:'1.0-1'}}</md-list-item>
          <md-list-item>Interval: {{group.intervalDisplay}}</md-list-item>
          <md-list-item>Goal event: {{group.goalTime.distance}} @ {{group.goalTime.duration}}</md-list-item>
          <md-list-item>Total set time: {{group.totalSetTime}}</md-list-item>
        </md-list>
      </md-card-content>
    </md-card>
  `,
  styleUrls: ['./practice-groups.component.scss']
})
export class PracticeGroupsComponent implements OnInit, OnChanges {

  @Input()
  rp10: Rp10
  groups: object[]

  constructor() { }

  ngOnInit() {
    this._setGroups()
  }

  ngOnChanges() {
    this._setGroups()
  }

  _setGroups() {
    if (this.rp10) {
      this.groups = this.rp10.goalTimes.map(goalTime => {
        const practicePace = this.rp10.getSheetPracticePace(goalTime)
        return {
          goalTime,
          targetS: practicePace.targetS,
          intervalDisplay: this._formatTimeDisplay(practicePace.intervalS),
          totalSetTime: this._formatTimeDisplay(practicePace.intervalS * this.rp10.ofReps)
        }
      })
    } else {
      this.groups = []
    }
  }

  _formatTimeDisplay(timeS: number): string {
    const timeDuration = moment.duration(timeS, 'seconds')
    let timeDisplayS = timeDuration.seconds()
    let timeDisplay = timeDisplayS.toString()

    if (timeDisplay.length === 1) {
      timeDisplay = `0${timeDisplayS}`
    }

    if (timeDuration.minutes()) {
      timeDisplay = `${timeDuration.minutes()}:${timeDisplay}`
    }

    if (timeDuration.milliseconds()) {
      timeDisplay = `${timeDisplay}.${timeDuration.milliseconds()}`
    }

    return timeDisplay
  }

}
