import { Injectable } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { CommonService } from './common.service';
import * as jwt_decode from "jwt-decode";

@Injectable()
export class UserService {

  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });
  userinfo;
  siteurl;
  constructor(private http: Http, public CommonService: CommonService, platformLocation: PlatformLocation) {

    // console.log((platformLocation as any).location);
    // console.log((platformLocation as any).location.href);
    // console.log((platformLocation as any).location.origin);

    this.siteurl = (platformLocation as any).location.origin;
  }

  login(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/login', body , this.options).map((res: Response) => res.json());
  }

  register(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users', body , this.options).map((res: Response) => res.json());
  }

  updateOpentokSession(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/updateOpentokSession', body, this.options ).map((res: Response) => res.json());
  }

  getUser(data){
      return this.http.get(this.CommonService.base_url+'/users/get/' + data.id).map((res: Response) => res.json());
  }

  allUsers(){
      return this.http.get(this.CommonService.base_url+'/users/all').map((res: Response) => res.json());
  }

  goOnline(data){
      let body = JSON.stringify(data);
      return this.http.post(this.CommonService.base_url+'/users/goOnline', body , this.options).map((res: Response) => res.json());
  }

  getOnlineUsers(){
      return this.http.get(this.CommonService.base_url+'/users/getOnlineUsers').map((res: Response) => res.json());
  }

  changePassword(data){
    this.userinfo = jwt_decode(localStorage.getItem('jwtToken'));
    data.user_id = this.userinfo.id;
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/changepassword', body , this.options).map((res: Response) => res.json());
  }

  forgotPassword(data){
    data.site_url = this.siteurl+'/auth/reset-password';
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/forgotpassword', body , this.options).map((res: Response) => res.json());
  }

  resetPassword(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/resetpassword', body , this.options).map((res: Response) => res.json());
  }

  update(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/edit', body , this.options).map((res: Response) => res.json());
  }

  updateProfilePic(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/update_profile_image', body , this.options).map((res: Response) => res.json());
  }

  updateBannerPic(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/update_banner_image', body , this.options).map((res: Response) => res.json());
  }

  createAlbum(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/create_album', body , this.options).map((res: Response) => res.json());
  }

  getAlbums(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/get_albums', body , this.options).map((res: Response) => res.json());
  }

  uploadPhotos(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/upload_photos', body , this.options).map((res: Response) => res.json());
  }

  getAlbumPhotos(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/get_album_photos', body , this.options).map((res: Response) => res.json());
  }

  deleteAlbum(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/delete_album', body , this.options).map((res: Response) => res.json());
  }

  deleteImage(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/delete_image', body , this.options).map((res: Response) => res.json());
  }

  updatePaymentInfo(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/update_payment_info', body , this.options).map((res: Response) => res.json());
  }

  onlineUsers(){
    return this.http.get(this.CommonService.base_url+'/users/online_users').map((res: Response) => res.json());
  }

  getChannels(){
    return this.http.get(this.CommonService.base_url+'/users/get_channels').map((res: Response) => res.json());
  }

  latestVideo(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/latest_user_video', body , this.options).map((res: Response) => res.json());
  }

  latest5Videos(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/latest_user_videos_5', body , this.options).map((res: Response) => res.json());
  }

  likePhoto(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/like_photo', body , this.options).map((res: Response) => res.json());
  }

  likeVideo(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/like_video', body , this.options).map((res: Response) => res.json());
  }

  getFavoritePhotos(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/get_user_favorite_photos', body , this.options).map((res: Response) => res.json());
  }

  getFavoriteVideos(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/get_user_favorite_videos', body , this.options).map((res: Response) => res.json());
  }

  unlikePhoto(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/unlike_photo', body , this.options).map((res: Response) => res.json());
  }

  unlikeVideo(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/unlike_video', body , this.options).map((res: Response) => res.json());
  }

  updatePlans(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/update_plans', body , this.options).map((res: Response) => res.json());
  }

  checkSubscribed(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/check_subscribed', body , this.options).map((res: Response) => res.json());
  }

  getSubscriptions(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/get_subscriptions', body , this.options).map((res: Response) => res.json());
  }

  listUserSubscriptions(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/list_user_subscriptions', body , this.options).map((res: Response) => res.json());
  }

  allSubscriptions(){
    return this.http.get(this.CommonService.base_url+'/users/all_subscriptions').map((res: Response) => res.json());
  }

  getSubscription(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/users/get_subscription', body , this.options).map((res: Response) => res.json());
  }
  

}
