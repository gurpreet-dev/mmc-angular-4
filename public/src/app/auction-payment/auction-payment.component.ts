import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { PaypalService } from '../services/paypal.service';
import { AuctionService } from '../services/auction.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-auction-payment',
  templateUrl: './auction-payment.component.html',
  styleUrls: ['./auction-payment.component.css']
})
export class AuctionPaymentComponent implements OnInit {

  auction_id;
  user_id;
  auction = {
    file: '',
    title: '',
    start_date: '',
    end_Date: '',
    bids: [],
    price: 0
  };
  bids = 0;
  highest_bid = 0;
  highest_bidder = '';

  cc_form: FormGroup;
  errors;
  userinfo = {
    _id: '',
    firstname: 'Unknown',
    lastname: 'Unknown',
    email: ''
  };
  channel_id;

  cardtypes = ['mastercard', 'visa', 'discover', 'jcb', 'american express']

  label_paypal = 'Submit';
  label_cc_paypal = 'Save and Proceed';
  isDisabled = false;

  constructor(
    public formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public PaypalService: PaypalService,
    public AuctionService: AuctionService,
    public UserService: UserService
  ) {
    this.activatedRoute.params.subscribe(paramsId => {
      this.auction_id = paramsId.auctionid;
    });
    this.activatedRoute.params.subscribe(paramsId => {
      this.user_id = paramsId.userid;
    });

    console.log(this.auction_id, this.user_id)

    this.cc_form = formBuilder.group({
      card_number: ['', [Validators.required]],
      expire_date: ['', [Validators.required]],
      cvv2: ['', [Validators.required]],
      card_type: ['', [Validators.required]]
    });

    this.UserService.getUser({ id: this.user_id }).subscribe(
      data => {
        if(data.status = true){
          this.userinfo = data.data;
        }
      }, error => {

      }
    )

    this.getAuction();
  }

  ngOnInit() {
  }

  getAuction(){
    this.AuctionService.getExpiredAuction({ id: this.auction_id }).subscribe(
      data => {
        if(data.status == true){
          this.auction = data.data;
          this.getBids();
        }
      }
    )
  }

  getBids(){
    this.AuctionService.getExpiredAuctionBids({ id: this.auction_id }).subscribe(
      data => {
        if(data.status == true){
          this.highest_bid = data.data[0].bids.price;
          this.highest_bidder = data.data[0].user[0].firstname+' '+data.data[0].user[0].lastname;
          this.bids = data.data.length;
        }
      }
    )
  }

  credit_card(){

    if (this.cc_form.invalid) {
      this.validateAllFormFields(this.cc_form);
    }else{

        this.cc_form.value.firstname = this.userinfo.firstname;
        this.cc_form.value.lastname = this.userinfo.lastname;
        this.cc_form.value.price = this.highest_bid;
        this.cc_form.value.auction_id = this.auction_id;
        this.cc_form.value.email = this.userinfo.email;
        this.cc_form.value.user_id = this.user_id;

        this.label_cc_paypal = 'Please wait..';
        this.isDisabled = true;

        Swal({
          title: 'Please Wait!',
          html: 'Do not refresh the page..',
          onOpen: () => {
            Swal.showLoading()
          }
        });

        this.PaypalService.auction_paypal_cc_payment(this.cc_form.value).subscribe(
          data => {
            Swal.close();
            if(data.status == true){
              if(data.data.state == 'approved' || data.data.state == 'completed'){
                Swal('Success', 'Payment successfull! we will send you email containing file link!', 'success');
              }else{
                Swal('oops', 'Payment is unsuccessfull. Please try again later!', 'error');
              }
              
            }else{
              if(data.type == 'validation'){
                var html = '';

                for(var i = 0; i < data.data.response.details.length; i++){

                  var field = data.data.response.details[i].field.split('.')

                  if(field[3] === 'undefined' || field[3] === undefined){
                    html += data.data.response.details[i].issue+'<br>';
                  }else{
                    html += '<b>'+field[3]+': </b>'+data.data.response.details[i].issue+'<br>';
                  }
                }
                

                Swal({
                  title: 'oops',
                  type: 'info',
                  html: html
                })


              }else{
                Swal('oops', data.message, 'error');
              }
            }

            this.label_cc_paypal = 'Save and Proceed';
            this.isDisabled = false;
            this.cc_form.reset();

          }, error => {

          }
        )

    }  
  }

  paypal(){

    var info = {
        firstname : this.userinfo.firstname,
        lastname : this.userinfo.lastname,
        price : this.highest_bid,
        auction_id : this.auction_id,
        email : this.userinfo.email,
        user_id: this.user_id
    }

    this.label_paypal = 'Please wait..';
    this.isDisabled = true;


    this.PaypalService.auction_paypal(info).subscribe(
      data => {
        if(data.status == true){

          for (var index = 0; index < data.data.links.length; index++) {
            if (data.data.links[index].rel === 'approval_url') {
              this.label_paypal = 'Redirecting...';
              window.location.href = data.data.links[index].href;
            }
          }
        }else{
          
          Swal('oops', 'Try again later!', 'error');
        }

        this.label_paypal = 'Submit';
        this.isDisabled = false;

      }, error => {
        console.log(error);
      }
    )

  }  

  validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }  

}
