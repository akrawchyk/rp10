import { Pipe, PipeTransform } from '@angular/core'

import { formatTimeDisplay } from './rp10'

@Pipe({
  name: 'time',
})
export class TimePipe implements PipeTransform {
  transform(valueS: number, args?: any): any {
    return formatTimeDisplay(valueS)
  }
}
