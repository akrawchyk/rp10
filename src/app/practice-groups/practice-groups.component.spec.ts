import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { PracticeGroupsComponent } from './practice-groups.component'

describe('PracticeGroupsComponent', () => {
  let component: PracticeGroupsComponent
  let fixture: ComponentFixture<PracticeGroupsComponent>

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [PracticeGroupsComponent],
      }).compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeGroupsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should be created', () => {
    expect(component).toBeTruthy()
  })
})
