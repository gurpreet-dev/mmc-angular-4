import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';

import { CommonService } from '../../services/common.service';

@Injectable()
export class DataService {

  result: any;

  constructor(private _http: Http, public CommonService: CommonService) { }

  getTodos() {
    return this._http.get(this.CommonService.base_url+'/todos')
      .map(result => result.json().data);
  }

  createTodo(body) {
    let bodyString = JSON.stringify(body);
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post(this.CommonService.base_url+'/todo', body, options)
      .map((res: Response) => res.json());
  }

  deleteTodo(todoId) {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.delete(this.CommonService.base_url+'/todo/'+todoId, options)
      .map((res: Response) => res.json());
  }

}
