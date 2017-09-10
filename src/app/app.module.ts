import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'

import {
  MdListModule,
  MdCardModule,
  MdToolbarModule,
  MdButtonModule,
  MdRadioModule,
  MdInputModule,
  MdSelectModule,
} from '@angular/material'

import { AppComponent } from './app.component'
import { AppFormComponent } from './app-form/app-form.component'
import { GoalTimesComponent } from './goal-times/goal-times.component'
import { PracticeGroupsComponent } from './practice-groups/practice-groups.component'
import { SecondsProExporterComponent } from './seconds-pro-exporter/seconds-pro-exporter.component'
import { DurationPipe } from './duration.pipe'
import { EmailExportService } from './email-export.service'

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MdListModule,
    MdCardModule,
    MdToolbarModule,
    MdButtonModule,
    MdRadioModule,
    MdInputModule,
    MdSelectModule,
  ],
  declarations: [
    AppComponent,
    AppFormComponent,
    GoalTimesComponent,
    PracticeGroupsComponent,
    SecondsProExporterComponent,
    DurationPipe,
  ],
  providers: [EmailExportService],
  bootstrap: [AppComponent],
})
export class AppModule {}
