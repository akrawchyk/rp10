import { Component, OnChanges, OnInit, Input } from '@angular/core';

import { Rp10 } from '../rp10'

@Component({
  selector: 'app-practice-groups',
  template: `
    <ul>
      <li *ngFor="let group of groups">
        {{group.pace}}
      </li>
    </ul>
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
        return { pace: this.rp10.getSheetPaceToTrainToday(goalTime) }
      })
    } else {
      this.groups = []
    }
  }

}
