import { Injectable } from '@angular/core'
import { Headers, Http } from '@angular/http'

import 'rxjs/add/operator/toPromise'

@Injectable()
export class EmailExportService {
  constructor(private http: Http) {}

  // private rp10Url = 'https://strive-swim.herokuapp.com/rp10s/new'
  private rp10Url = 'http://localhost:4000/rp10s/new'

  newEmail(body): Promise<any> {
    return this.http
      .post(this.rp10Url, body)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError)
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error)
  }
}
