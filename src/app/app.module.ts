import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'

import {
  MdToolbarModule,
  MdButtonModule,
  MdRadioModule,
  MdInputModule,
  MdSelectModule
} from '@angular/material'

import { AppComponent } from './app.component'
import { AppFormComponent } from './app-form/app-form.component'

@NgModule({
  declarations: [AppComponent, AppFormComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
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
