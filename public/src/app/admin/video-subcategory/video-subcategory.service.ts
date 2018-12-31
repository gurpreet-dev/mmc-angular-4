import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { CommonService } from '../../services/common.service';

@Injectable()
export class VideoSubcategoryService {


  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http, public CommonService: CommonService) { }

  add(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/video-subcategories/add', body , this.options).map((res: Response) => res.json());
  }

  list() {
    return this.http.get(this.CommonService.base_url+'/video-subcategories/').map((res: Response) => res.json());
  }

  get(id) {
    return this.http.get(this.CommonService.base_url+'/video-subcategories/edit/'+id).map((res: Response) => res.json());
  }

  edit(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/video-subcategories/edit/'+data.id , body , this.options).map((res: Response) => res.json());
  }

  delete(id) {
    return this.http.get(this.CommonService.base_url+'/video-categories/delete/'+id).map((res: Response) => res.json());
  }

  addVideo(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/video-subcategories/add_video' , body , this.options).map((res: Response) => res.json());
  }

  getSubcategoryVideos(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/video-subcategories/get_subcat_videos' , body , this.options).map((res: Response) => res.json());
  }

  getSubcategoryVideosById(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/video-subcategories/get_subcat_videosById' , body , this.options).map((res: Response) => res.json());
  }

  getVideo(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/video-subcategories/get_video' , body , this.options).map((res: Response) => res.json());
  }

  addView(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/video-subcategories/add_view' , body , this.options).map((res: Response) => res.json());
  }

  getViews(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/video-subcategories/get_views' , body , this.options).map((res: Response) => res.json());
  }

  getVideos(){
    return this.http.get(this.CommonService.base_url+'/video-subcategories/get_videos').map((res: Response) => res.json());
  }

  getAllVideos(){
    return this.http.get(this.CommonService.base_url+'/video-subcategories/get_all_videos').map((res: Response) => res.json());
  }

  searchVideos(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/video-subcategories/search_videos', data, this.options).map((res: Response) => res.json());
  }


}
