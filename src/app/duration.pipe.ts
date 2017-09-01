import { Pipe, PipeTransform } from '@angular/core'

import { formatDurationDisplay } from './rp10'

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(valueS: number, args?: any): any {
    return formatDurationDisplay(valueS)
  }
}
