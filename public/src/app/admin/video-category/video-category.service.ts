import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { CommonService } from '../../services/common.service';

@Injectable()
export class VideoCategoryService {


  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http, public CommonService: CommonService) { }

  add(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/video-categories/add', body , this.options).map((res: Response) => res.json());
  }

  list() {
    return this.http.get(this.CommonService.base_url+'/video-categories/').map((res: Response) => res.json());
  }

  front_list() {
    return this.http.get(this.CommonService.base_url+'/video-categories/front_list').map((res: Response) => res.json());
  }

  get(id) {
    return this.http.get(this.CommonService.base_url+'/video-categories/edit/'+id).map((res: Response) => res.json());
  }

  edit(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/video-categories/edit/'+data.id , body , this.options).map((res: Response) => res.json());
  }

  delete(id) {
    return this.http.get(this.CommonService.base_url+'/video-categories/delete/'+id).map((res: Response) => res.json());
  }

  getUserVideos(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/video-categories/get_user_videos', body , this.options).map((res: Response) => res.json());
  }

}
