import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { CommonService } from './common.service';
import { PlatformLocation } from '@angular/common';

@Injectable()
export class PaypalService {

  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });
  siteurl;

  constructor(private http: Http, public CommonService: CommonService, platformLocation: PlatformLocation) {
    this.siteurl = (platformLocation as any).location.origin;
  }

  cc_payment(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/payments/paypal_cc_payment', body , this.options).map((res: Response) => res.json());
  }

  paypal(data) {
    data.baseurl = this.siteurl;
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/payments/paypal', body , this.options).map((res: Response) => res.json());
  }

  paypal_execute(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/payments/paypal_execute', body , this.options).map((res: Response) => res.json());
  }

  /*****************/

  cc_payment2(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/payments/paypal_cc_payment2', body , this.options).map((res: Response) => res.json());
  }

  paypal2(data) {
    data.baseurl = this.siteurl;
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/payments/paypal2', body , this.options).map((res: Response) => res.json());
  }

  paypal_execute2(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/payments/paypal_execute2', body , this.options).map((res: Response) => res.json());
  }

  /*****************/

  auction_paypal_cc_payment(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/payments/auction_paypal_cc_payment', body , this.options).map((res: Response) => res.json());
  }

  auction_paypal(data) {
    data.baseurl = this.siteurl;
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/payments/auction_paypal', body , this.options).map((res: Response) => res.json());
  }

  auction_paypal_execute(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/payments/auction_paypal_execute', body , this.options).map((res: Response) => res.json());
  }

}
