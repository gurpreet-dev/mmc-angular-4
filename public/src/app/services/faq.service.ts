import { Injectable } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { CommonService } from './common.service';

@Injectable()
export class FaqService {

  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });
  constructor(private http: Http, public CommonService: CommonService) {
  }

  add(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/faq/add', body , this.options).map((res: Response) => res.json());
  }

  list() {
    return this.http.get(this.CommonService.base_url+'/faq').map((res: Response) => res.json());
  }

  get(id) {
    return this.http.get(this.CommonService.base_url+'/faq/get/'+id).map((res: Response) => res.json());
  }

  edit(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/faq/edit', body , this.options).map((res: Response) => res.json());
  }

  delete(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/faq/delete', body , this.options).map((res: Response) => res.json());
  }

}
