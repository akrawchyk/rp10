import FileSaver from 'file-saver'
import { Component, Input, OnInit } from '@angular/core'

import { Rp10 } from '../rp10'

@Component({
  selector: 'app-seconds-pro-exporter',
  template: `
    <button md-raised-button (click)="onClick()" color="accent" type="button">
      <span class="material-icons">get_app</span> Export to <code>.seconds</code>
    </button>
    <a >
  `,
  styleUrls: ['./seconds-pro-exporter.component.scss']
})
export class SecondsProExporterComponent implements OnInit {
  @Input() rp10: Rp10

  @Input() goalTimeIndex: number = 0

  constructor() {}

  ngOnInit() {
    // FIXME remove moment locales from bundle
  }

  onClick() {
    // export rp10 -> .seconds
    const secondsFormat = this.rp10.toSecondsProFormat()[this.goalTimeIndex]
    const blob = new Blob([JSON.stringify(secondsFormat, null, 2)], {
      type: 'application/json'
    })
    FileSaver.saveAs(blob, `${secondsFormat.name}_RP10_export.seconds`)
  }
}
