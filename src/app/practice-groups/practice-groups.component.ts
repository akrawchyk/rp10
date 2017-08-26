import * as moment from 'moment'

import { Component, OnChanges, OnInit, Input } from '@angular/core';

import { Rp10 } from '../rp10'

@Component({
  selector: 'app-practice-groups',
  template: `
    <md-card class="practice-group" *ngFor="let group of groups; index as i">
      <md-card-header>
        <md-card-title>
          <h3>Group {{i+1}}</h3>
        </md-card-title>
      </md-card-header>
      <md-card-content>
        <md-list>
          <md-list-item>Target: {{group.targetDisplay}}</md-list-item>
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
          targetDisplay: this._formatTimeDisplay(practicePace.targetS),
          intervalDisplay: this._formatTimeDisplay(practicePace.intervalS),
          totalSetTime: this._formatTimeDisplay(practicePace.intervalS * this.rp10.repCount)
        }
      })
    } else {
      this.groups = []
    }
  }

  _formatTimeDisplay(timeS: number): string {
    const timeDuration = moment.duration(timeS, 'seconds')
    let timeDisplayS = timeDuration.seconds()
    let timeDisplayM = timeDuration.minutes()
    let timeDisplayMs = timeDuration.milliseconds()
    let timeDisplay = timeDisplayS.toString()

    if (timeDisplayM) {
      if (timeDisplay.length === 1) {
        timeDisplay = `0${timeDisplayS}`
      }

      timeDisplay = `${timeDisplayM}:${timeDisplay}`
    }

    if (timeDisplayMs) {
      // round up to nearest 100th and take first digit
      timeDisplay = `${timeDisplay}.${(Math.ceil(timeDuration.milliseconds()/100)*100).toString()[0]}`
    }

    return timeDisplay
  }

}
