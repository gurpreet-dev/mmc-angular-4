import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { PaypalService } from '../services/paypal.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subscription-status',
  templateUrl: './subscription-status.component.html',
  styleUrls: ['./subscription-status.component.css']
})
export class SubscriptionStatusComponent implements OnInit {

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

    this.PaypalService.paypal_execute2(this.params).subscribe(
      data => {
        
        if(data.status == true){
          Swal('Success', 'Subscription successfull!', 'success')
        }else{
          Swal('oops', data.message, 'error')
        }
      }, error => {
        console.log(error);
      }
    )
  }

  ngOnInit() { }

}
