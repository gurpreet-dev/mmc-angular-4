import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { CommonService } from './common.service';

@Injectable()
export class AdminService {

  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http, public CommonService: CommonService) { }

  login(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/adminlogin', body , this.options).map((res: Response) => res.json());
  }

}
