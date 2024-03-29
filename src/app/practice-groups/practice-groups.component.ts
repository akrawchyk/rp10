import { Component, OnChanges, OnInit, Input } from '@angular/core'

import { Rp10, formatDurationDisplay } from '../rp10'

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
          <md-list-item>Target: {{group.target | duration}}</md-list-item>
          <md-list-item>Interval: {{group.interval | duration}}</md-list-item>
          <md-list-item>Goal event: {{group.goalTime.distance}}{{group.goalPoolType}} @ {{group.goalTime.duration | duration}}</md-list-item>
          <md-list-item>Total set time: {{group.totalSetTime | duration}}</md-list-item>
        </md-list>
      </md-card-content>
    </md-card>
  `,
  styleUrls: ['./practice-groups.component.scss'],
})
export class PracticeGroupsComponent implements OnInit, OnChanges {
  @Input() rp10: Rp10

  groups: object[]

  constructor() {}

  ngOnInit() {
    this._setGroups()
  }

  ngOnChanges() {
    this._setGroups()
  }

  _setGroups() {
    if (this.rp10) {

      this.groups = this.rp10.goalTimes.map(goalTime => {
        const target = this.rp10.getTargetForGoalTime(goalTime)
        const interval = this.rp10.getIntervalForGoalTime(goalTime)

        return {
          goalTime,
          goalPoolType: this.rp10.myGoalTimeIsFor[
            this.rp10.myGoalTimeIsFor.length - 1
          ].toLowerCase(),
          target,
          interval,
          totalSetTime: interval * this.rp10.repCount
        }
      })
    } else {
      this.groups = []
    }
  }
}
