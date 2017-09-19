import { Injectable } from '@angular/core'
import { Headers, Http } from '@angular/http'

import 'rxjs/add/operator/toPromise'

@Injectable()
export class EmailExportService {
  constructor(private http: Http) {}

  // private emailsUrl = 'https://strive-swim.herokuapp.com/emails'
  private emailsUrl = 'http://localhost:4000/emails'

  newEmail(body): Promise<any> {
    return this.http
      .post(this.emailsUrl, body)
      .toPromise()
      .then(response => response.json())
      .catch(this.handleError)
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error) // for demo purposes only
    return Promise.reject(error.message || error)
  }
}
