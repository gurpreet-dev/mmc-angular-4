import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { AuctionService } from '../../services/auction.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import * as jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bid',
  templateUrl: './bid.component.html',
  styleUrls: ['./bid.component.css']
})
export class BidComponent implements OnInit {

  auction = {
    file: '',
    title: '',
    start_date: '',
    end_Date: '',
    bids: [],
    price: 0
  };
  bids = 0;
  auction_id;
  channel_id;
  highest_bid = 0;
  highest_bidder = '';

  form: FormGroup;
  userinfo: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    public AuctionService: AuctionService,
    private router: Router,
    public formBuilder: FormBuilder
  ) {

    this.form = formBuilder.group({
      bid: ['', [Validators.required, Validators.pattern(/^[0-9]+\.?[0-9]*$/)]]
    });

    this.activatedRoute.params.subscribe(paramsId => {
      this.channel_id = paramsId.id;
    });

    this.activatedRoute.params.subscribe(paramsId => {
      this.auction_id = paramsId.auctionid;
    });

    this.getAuction();

  }

  ngOnInit() {

    // document.addEventListener('contextmenu', function(e) {
    //   e.preventDefault();
    // });

    // document.onkeydown = function(e) {
    //   if(e.keyCode == 123) {
    //      return false;
    //   }
    //   if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
    //      return false;
    //   }
    //   if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
    //      return false;
    //   }
    //   if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
    //      return false;
    //   }
    //   if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
    //      return false;
    //   }
    // }
  }

  getAuction(){
    this.AuctionService.getAuction({ id: this.auction_id }).subscribe(
      data => {
        if(data.status == true){
          this.auction = data.data;
          this.getBids();
        }else{
          this.router.navigate(['/channel/auctions/'+this.channel_id])
        }
      }
    )
  }

  getBids(){
    this.AuctionService.getAuctionBids({ id: this.auction_id }).subscribe(
      data => {
        if(data.status == true){
          this.highest_bid = data.data[0].bids.price;
          this.highest_bidder = data.data[0].user[0].firstname+' '+data.data[0].user[0].lastname;
          this.bids = data.data.length;
        }
      }
    )
  }

  save(){
    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
    }else{
      if(this.highest_bid > 0){
        if(this.form.value.bid <= this.highest_bid){
          alert('Please enter price greater than highest bid i.e $'+this.highest_bid);
        }else{
          this.bidNow();
        }
      }else{
        if(this.form.value.bid <= this.auction.price){
          alert('Please enter price greater than Base price i.e $'+this.auction.price);
        }else{
          this.bidNow();
        }
      }
    }
  }


  bidNow(){

    this.userinfo = jwt_decode(localStorage.getItem('jwtToken'));

    var info = {
      price: this.form.value.bid,
      auction_id: this.auction_id,
      user_id: this.userinfo.id
    }

    this.AuctionService.createBid(info).subscribe(
      data => {
        if(data.status == true){
          this.getBids();
          this.form.reset();
          Swal('Success', data.message, 'success');
        }else{
          Swal('oops', data.message, 'error');
        }
      }
    )

  }

  expireAuction(data: any){
    Swal({
      title: 'Redirecting...',
      html: 'This auction has been expired now.',
      timer: 2000,
      onOpen: () => {
        Swal.showLoading()
      },
      onClose: () => {
        this.router.navigate(['/channel/auctions/'+this.channel_id]);
      }
    })
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
