import { Component, OnInit } from '@angular/core';
import * as jwt_decode from "jwt-decode";
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  userinfo;
  userdata = {
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    dob: '',
    country: '',
    gender: ''
  }

  constructor(
    public UserService: UserService
  ) {

    this.userinfo = jwt_decode(localStorage.getItem('jwtToken'));

    this.UserService.getUser({id:this.userinfo.id}).subscribe(
      data => {
        if(data.status == true){
          this.userdata = data.data
        }
      },
      error => {
          console.log(error);
      }
    );

  }

  ngOnInit() { }

}
