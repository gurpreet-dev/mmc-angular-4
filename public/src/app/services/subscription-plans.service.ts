import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { CommonService } from './common.service';

@Injectable()
export class SubscriptionPlansService {

  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http, public CommonService: CommonService) { }

  add(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/plans/add', body , this.options).map((res: Response) => res.json());
  }

  list() {
    return this.http.get(this.CommonService.base_url+'/plans').map((res: Response) => res.json());
  }

  delete(id) {
    return this.http.get(this.CommonService.base_url+'/plans/delete/'+id).map((res: Response) => res.json());
  }

  get(id) {
    return this.http.get(this.CommonService.base_url+'/plans/edit/'+id).map((res: Response) => res.json());
  }

  edit(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/plans/editt', body , this.options).map((res: Response) => res.json());
  }

}
