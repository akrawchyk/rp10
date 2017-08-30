import FileSaver from 'file-saver'
import JSZip from 'jszip'
import { Component, Input, OnInit } from '@angular/core'

import { Rp10 } from '../rp10'

@Component({
  selector: 'app-seconds-pro-exporter',
  template: `
    <button md-raised-button (click)="onClick()" color="accent" type="button" [disabled]="loading">
      <span class="material-icons">get_app</span> Export to .seconds
    </button>
    <p class="message message--error" *ngIf="errorMessage">{{errorMessage}}</p>
  `,
  styleUrls: ['./seconds-pro-exporter.component.scss']
})
export class SecondsProExporterComponent implements OnInit {
  @Input() rp10: Rp10

  errorMessage: string = ''

  loading: boolean = false

  constructor() {}

  ngOnInit() {
  }

  onClick() {
    this.loading = true
    this.errorMessage = ''

    // export rp10 -> .seconds -> .zip
    const zip = new JSZip()
    this.rp10.toSecondsProFormat().forEach(secondsFormat => {
      const name = secondsFormat.name.split(' ').join('_')
      zip.file(`${name}_RP10_export.seconds`, JSON.stringify(secondsFormat))
    })

    zip.generateAsync({ type: 'blob' })
      .then(blob => {
        FileSaver.saveAs(blob, 'RP10_seconds_export.zip')
      }, err => {
        this.errorMessage = err.message
      })
      .then(err => {
        this.loading = false
      })
  }
}
