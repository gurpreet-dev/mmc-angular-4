import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  subscription_id;
  subscription = {
    startdate: '',
    enddate: '',
    payment_type: '',
    transaction_id: '',
    status: ''
  }

  user = {
    name: '',
    _id: ''
  }

  channel = {
    name: '',
    _id: ''
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public UserService: UserService
  ) {
    this.activatedRoute.params.subscribe(paramsId => {
      this.subscription_id = paramsId.id;
    });
  }

  ngOnInit() {
    this.getUser();
  }

  getUser(){

    this.UserService.getSubscription({ id: this.subscription_id }).subscribe(
      data => {
        console.log(data);
          if(data.status == true){
            this.subscription = data.data[0];
            this.user = data.data[0].user[0];
            this.channel = data.data[0].channel[0];
          }
      },
      error => {
          console.log(error); 
      }
    );

  }

}
