import { Injectable } from '@angular/core';
import { PlatformLocation } from '@angular/common';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { CommonService } from './common.service';

@Injectable()
export class AuctionService {

  headers = new Headers({ 'Content-Type': 'application/json' });
  options = new RequestOptions({ headers: this.headers });
  constructor(private http: Http, public CommonService: CommonService) {
  }

  add(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/auction/add', body , this.options).map((res: Response) => res.json());
  }

  channelAuctions(data) {
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/auction/channel_auctions', body , this.options).map((res: Response) => res.json());
  }

  channelFrontAuctions(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/auction/channel_front_auctions', body , this.options).map((res: Response) => res.json());
  }

  channelFrontAuctionPhotos(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/auction/channel_front_auction_photos', body , this.options).map((res: Response) => res.json());
  }

  channelFrontAuctionVideos(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/auction/channel_front_auction_videos', body , this.options).map((res: Response) => res.json());
  }

  getAuction(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/auction/get_auction', body , this.options).map((res: Response) => res.json());
  }

  createBid(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/auction/create_bid', body , this.options).map((res: Response) => res.json());
  }

  getAuctionBids(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/auction/get_auction_bids', body , this.options).map((res: Response) => res.json());
  }

  getExpiredAuctionBids(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/auction/get_expired_auction_bids', body , this.options).map((res: Response) => res.json());
  }

  getExpiredAuction(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/auction/get_expired_auction', body , this.options).map((res: Response) => res.json());
  }

  getSubscriberAuctions(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/auction/get_subscriber_auctions', body , this.options).map((res: Response) => res.json());
  }

  getAuctionData(data){
    let body = JSON.stringify(data);
    return this.http.post(this.CommonService.base_url+'/auction/get_auction_data', body , this.options).map((res: Response) => res.json());
  }

  list(){
    return this.http.get(this.CommonService.base_url+'/auction/list').map((res: Response) => res.json());
  }

}
