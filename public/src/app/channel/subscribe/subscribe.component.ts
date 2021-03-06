import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { SubscriptionPlansService } from '../../services/subscription-plans.service';
import { UserService } from '../../services/user.service';
import { PaypalService } from '../../services/paypal.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from "@angular/router";
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-subscribe',
  templateUrl: './subscribe.component.html',
  styleUrls: ['./subscribe.component.css']
})
export class SubscribeComponent implements OnInit {

  plans = [];
  plantype = '';
  cc_form: FormGroup;
  errors;
  userinfo: any;
  channel_id;
  subcribed: any;

  cardtypes = ['mastercard', 'visa', 'discover', 'jcb', 'american express']

  label_paypal = 'Submit';
  label_cc_paypal = 'Save and Proceed';
  isDisabled = false;

  constructor(
    public SubscriptionPlansService: SubscriptionPlansService,
    public PaypalService: PaypalService,
    public UserService: UserService,
    public formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.cc_form = formBuilder.group({
      card_number: ['', [Validators.required]],
      expire_date: ['', [Validators.required]],
      cvv2: ['', [Validators.required]],
      card_type: ['', [Validators.required]]
    });
  }

  ngOnInit() {


    /******* Fetching Channel data *******/

    this.activatedRoute.params.subscribe(paramsId => {
      this.channel_id = paramsId.id;
    });

    this.UserService.getUser({ id: this.channel_id }).subscribe(
      data => {
        if(data.status = true){
          this.plans = data.data.plans;
        }
      }, error => {

      }
    )

    /******************************/


    /******* Fetching Logged In user data *******/

    this.userinfo = jwt_decode(localStorage.getItem('jwtToken'));

    if(this.userinfo.role != 'subscriber'){
      this.router.navigate(['/']);
    }
    
    this.UserService.getUser({ id: this.userinfo.id }).subscribe(
      data => {
        if(data.status = true){
          this.userinfo = data.data;

          this.UserService.checkSubscribed({ user_id: this.userinfo._id, channel_id: this.channel_id }).subscribe(
            data => {
              if(data.status == true){
                this.subcribed = data.data;
                Swal('Already subscribed', 'You are already subscribed to this channel!', 'info');
              }
            }
          )

        }else{
          Swal('oops', 'login agin to continue!', 'error');
        }
      }, error => {

      }
    )

    /****************************************/ 

  }

  credit_card(){

    if (this.cc_form.invalid) {
      this.validateAllFormFields(this.cc_form);
    }else{
      if(this.plantype == ''){
        alert('Please select plan!');
      }else{
        this.cc_form.value.plan_id = this.plantype;
        this.cc_form.value.current_user = this.userinfo;

        this.label_cc_paypal = 'Please wait..';
        this.isDisabled = true;

        this.PaypalService.cc_payment2(this.cc_form.value).subscribe(
          data => {
            if(data.status == true){

              if(data.data.state == 'approved' || data.data.state == 'completed'){
                Swal('Success', 'Subscription successfull!', 'success');
              }else{
                Swal('oops', 'Subscription is unsuccessfull. Please try again later!', 'error');
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
  }

  paypal(){
    if(this.plantype == ''){
      alert('Please select plan!');
    }else{
      var info = {
        plan_id: this.plantype,
        current_user: this.userinfo
      }

      this.label_paypal = 'Please wait..';
      this.isDisabled = true;

      this.PaypalService.paypal2(info).subscribe(
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
