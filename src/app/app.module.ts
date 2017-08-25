import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import {
  MdListModule,
  MdCardModule,
  MdToolbarModule,
  MdButtonModule,
  MdRadioModule,
  MdInputModule,
  MdSelectModule
} from '@angular/material'

import { AppComponent } from './app.component'
import { AppFormComponent } from './app-form/app-form.component'
import { GoalTimesComponent } from './goal-times/goal-times.component';
import { PracticeGroupsComponent } from './practice-groups/practice-groups.component'

@NgModule({
  declarations: [AppComponent, AppFormComponent, GoalTimesComponent, PracticeGroupsComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MdListModule,
    MdCardModule,
    MdToolbarModule,
    MdButtonModule,
    MdRadioModule,
    MdInputModule,
    MdSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
