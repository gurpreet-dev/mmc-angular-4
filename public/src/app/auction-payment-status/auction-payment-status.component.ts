import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { PaypalService } from '../services/paypal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-auction-payment-status',
  templateUrl: './auction-payment-status.component.html',
  styleUrls: ['./auction-payment-status.component.css']
})
export class AuctionPaymentStatusComponent implements OnInit {

  params: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public PaypalService: PaypalService
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.params = params;
    });

    Swal({
      title: 'Please wait!',
      onOpen: () => {
        Swal.showLoading()
      }
    })

    this.PaypalService.auction_paypal_execute(this.params).subscribe(
      data => {
        
        if(data.status == true){
          Swal('Success', 'Auction payment successfull!', 'success')
        }else{
          Swal('oops', data.message, 'error')
        }
      }, error => {
        console.log(error);
      }
    )
  }

  ngOnInit() {
  }

}
