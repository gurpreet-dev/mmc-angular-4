import { Injectable } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { CommonService } from '../../services/common.service';

@Injectable()
export class StaticPagesService {

  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });
  constructor(private http: Http, public CommonService: CommonService) {
  }

  add(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/static-pages/add', body , this.options).map((res: Response) => res.json());
  }

}
