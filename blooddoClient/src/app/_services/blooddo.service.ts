import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class BlooddoService {

  constructor(private http: Http) {}

  getDonors(extent) : Observable<any> {
    return this.http.get('api/donors?xmin='+extent.xmin+'&xmax='+extent.xmax+'&ymin='+extent.ymin+'&ymax='+extent.ymax)
                    .map(this.extractData)
                    .catch(this.handleError);

  }

  postDonor(newDonor) : Observable<any> {
    return this.http.post('api/donor', newDonor)
                    .map(this.extractData)
                    .catch(this.handleError);

  }

  getDonor(link) : Observable<any> {
    return this.http.get('api/donor/'+link)
                    .map(this.extractData)
                    .catch(this.handleError);

  }

  deleteDonor(link) : Observable<any> {
    return this.http.delete('api/donor/'+link)
                    .map(this.extractData)
                    .catch(this.handleError);

  }

  updateDonor(link, donor) : Observable<any> {
    return this.http.put('api/donor/'+link, {
      firstName: donor.firstName,
      lastName: donor.lastName,
      contactNumber: donor.contactNumber,
      email: donor.email,
      bloodGroup: donor.bloodGroup
    })
                    .map(this.extractData)
                    .catch(this.handleError);

  }

  private extractData(res: Response) {
    let body = res.json();
    return body || { };
  }

  private handleError (error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {

      let body = null;
      try {
        body = error.json();
        const err = body.error || JSON.stringify(body);
        errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        if (error.status === 400) errMsg = 'Server can not process your request. Probably your request is malformed.';
        if (error.status === 401) errMsg = 'Server can not process your request. You were not authorized to perform the action.';
      } catch (e) {
        errMsg = `${error.status} - ${error.statusText || ''} ${JSON.stringify(error)}`;
        if (error.status === 400) errMsg = 'Server can not process your request. Probably your request is malformed.';
        if (error.status === 401) errMsg = 'Server can not process your request. You were not authorized to perform the action.';
        if (error.status === 404) errMsg = 'Server can not process your request. Resource not found.';
      }

    } else {
      errMsg = error.message ? error.message : error.toString();
    }

    return Observable.throw(errMsg);
  }
}
