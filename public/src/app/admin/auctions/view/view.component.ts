import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { AuctionService } from '../../../services/auction.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  auction_id;

  auction = {
    file: '',
    title: '',
    start_date: '',
    end_Date: '',
    bids: [],
    price: 0
  };

  countbids = 0;
  bids: any;
  channel_id;
  highest_bid = 0;
  highest_bidder = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    public AuctionService: AuctionService,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe(paramsId => {
      this.auction_id = paramsId.id;
    });

    this.getAuction();
    this.getBids();
  }

  ngOnInit() {
  }

  getAuction(){
    this.AuctionService.getAuctionData({ id: this.auction_id }).subscribe(
      data => {
        console.log('auction',data)
        if(data.status == true){
          this.auction = data.data;
        }
      }
    )
  }

  getBids(){
    this.AuctionService.getAuctionBids({ id: this.auction_id }).subscribe(
      data => {
        console.log('bids',data)
        if(data.status == true){
          this.highest_bid = data.data[0].bids.price;
          this.highest_bidder = data.data[0].user[0].firstname+' '+data.data[0].user[0].lastname;
          this.countbids = data.data.length;
          this.bids = data.data;
        }
        setTimeout(()=>{ 

          (<any>$("#example2")).DataTable({
              'paging': true,
              'lengthChange': false,
              'searching': true,
              'ordering': false,
              'info': true,
              'autoWidth': false
            });  
        
         }, 1000);
      }
    )
  }

}
