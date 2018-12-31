import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  user_id;
  user = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    dob: '',
    age: '',
    role: '',
    country: '',
    profilepic: '',
    bannerpic: ''
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public UserService: UserService
  ) {
    this.activatedRoute.params.subscribe(paramsId => {
      this.user_id = paramsId.id;
    });
  }

  ngOnInit() {
    this.getUser();
  }

  getUser(){

    this.UserService.getUser({ id: this.user_id }).subscribe(
      data => {
        console.log(data);
          if(data.status == true){
            this.user = data.data;
          }
      },
      error => {
          console.log(error); 
      }
    );

  }

}
