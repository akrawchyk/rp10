import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { SecondsProExporterComponent } from './seconds-pro-exporter.component'

describe('SecondsProExporterComponent', () => {
  let component: SecondsProExporterComponent
  let fixture: ComponentFixture<SecondsProExporterComponent>

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [SecondsProExporterComponent],
      }).compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondsProExporterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should be created', () => {
    expect(component).toBeTruthy()
  })
})
