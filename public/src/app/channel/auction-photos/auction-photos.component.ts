import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { AuctionService } from '../../services/auction.service';

@Component({
  selector: 'app-auction-photos',
  templateUrl: './auction-photos.component.html',
  styleUrls: ['./auction-photos.component.css']
})
export class AuctionPhotosComponent implements OnInit {

  channel_id;
  auctions: any;
  auctions_count = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    public AuctionService: AuctionService
  ) {
    this.activatedRoute.params.subscribe(paramsId => {
      this.channel_id = paramsId.id;
    });

    this.AuctionService.channelFrontAuctionPhotos({ id: this.channel_id }).subscribe(
      data => {
        if(data.status == true){
          this.auctions = data.data
        }else{
          this.auctions_count = 0;
        }
      }
    )

  }

  ngOnInit() {
  }

}
