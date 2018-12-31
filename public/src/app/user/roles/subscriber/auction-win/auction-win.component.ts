import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuctionService } from '../../../../services/auction.service';
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-auction-win',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './auction-win.component.html',
  styleUrls: ['./auction-win.component.css']
})
export class AuctionWinComponent implements OnInit {

  userinfo;
  auctions:any;

  constructor(
    public AuctionService: AuctionService
  ) {
    this.userinfo = jwt_decode(localStorage.getItem('jwtToken'));

    this.AuctionService.getSubscriberAuctions({ id: this.userinfo.id }).subscribe(
      data => {
        
        if(data.status == true){
          this.auctions = data.data
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

  ngOnInit() {
  }

}
