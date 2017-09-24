import { Injectable } from '@angular/core'
import { Headers, Http } from '@angular/http'
import { environment } from '../environments/environment'

import 'rxjs/add/operator/toPromise'

@Injectable()
export class EmailExportService {
  constructor(private http: Http) {}

  newEmail(body): Promise<any> {
    return this.http
      .post(environment.rp10Url, body)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError)
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error)
  }
}
