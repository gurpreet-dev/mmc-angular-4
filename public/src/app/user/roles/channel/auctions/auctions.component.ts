import { Component, OnInit } from '@angular/core';
import { AuctionService } from '../../../../services/auction.service';
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-auctions',
  templateUrl: './auctions.component.html',
  styleUrls: ['./auctions.component.css']
})
export class AuctionsComponent implements OnInit {

  userinfo;
  auctions;
  auction = {
    _id: ''
  }

  bids = 0;
  highest_bid = 0;
  highest_bidder = '';
  expired = 0;

  constructor(
    public AuctionService: AuctionService
  ) {
    this.userinfo = jwt_decode(localStorage.getItem('jwtToken'));

    this.AuctionService.channelAuctions({ id: this.userinfo.id }).subscribe(
      data => {
        if(data.status == true){
          this.auctions = data.data
        }
      }
    )

  }

  ngOnInit() {
  }

  getAuction(id){
    this.expired = 0;
    this.AuctionService.getAuctionData({ id: id }).subscribe(
      data => {
        if(data.status == true){
          this.auction = data.data;

          var specific_date = new Date(data.data.end_date);
          var current_date = new Date();
          if(current_date.getTime() > specific_date.getTime()){
              this.expired = 1;
          }


          this.getBids();
        }
      }
    )
  }

  getBids(){

    this.bids = 0;
    this.highest_bid = 0;
    this.highest_bidder = '';

    this.AuctionService.getAuctionBids({ id: this.auction._id }).subscribe(
      data => {
        if(data.status == true){
          this.highest_bid = data.data[0].bids.price;
          this.highest_bidder = data.data[0].user[0].firstname+' '+data.data[0].user[0].lastname;
          this.bids = data.data.length;
        }
      }
    )
  }

}
