import * as moment from 'moment'

import { Component, OnChanges, OnInit, Input } from '@angular/core';

import { Rp10, formatTimeDisplay } from '../rp10'

@Component({
  selector: 'app-practice-groups',
  template: `
    <md-card class="practice-group" *ngFor="let group of groups; index as i">
      <md-card-header>
        <md-card-title>
          <h3 *ngIf="group.goalTime.name">{{group.goalTime.name}}</h3>
          <h3 *ngIf="!group.goalTime.name">Group {{i+1}}</h3>
        </md-card-title>
      </md-card-header>
      <md-card-content>
        <md-list>
          <md-list-item>Target: {{group.targetDisplay}}</md-list-item>
          <md-list-item>Interval: {{group.intervalDisplay}}</md-list-item>
          <md-list-item>Goal event: {{group.goalTime.distance}}{{group.goalPoolType}} @ {{group.goalTime.duration}}</md-list-item>
          <md-list-item>Total set time: {{group.totalSetTime}}</md-list-item>
        </md-list>
        <app-seconds-pro-exporter *ngIf="rp10" [rp10]="rp10" [goalTimeIndex]="i"></app-seconds-pro-exporter>
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
        const practicePace = this.rp10.getPracticePace(goalTime)
        return {
          goalTime,
          goalPoolType: this.rp10.myGoalTimeIsFor[this.rp10.myGoalTimeIsFor.length - 1].toLowerCase(),
          targetDisplay: formatTimeDisplay(practicePace.targetS),
          intervalDisplay: formatTimeDisplay(practicePace.intervalS),
          totalSetTime: formatTimeDisplay(practicePace.intervalS * this.rp10.repCount)
        }
      })
    } else {
      this.groups = []
    }
  }

}
