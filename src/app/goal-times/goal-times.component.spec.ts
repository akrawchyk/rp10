import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GoalTimesComponentComponent } from './goal-times-component.component';

describe('GoalTimesComponentComponent', () => {
  let component: GoalTimesComponentComponent;
  let fixture: ComponentFixture<GoalTimesComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GoalTimesComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GoalTimesComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
