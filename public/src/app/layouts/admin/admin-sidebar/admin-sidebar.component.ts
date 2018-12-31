import { Component, OnInit } from '@angular/core';
import { authService } from '../../../auth/auth.service';
import { UserService } from '../../../services/user.service';
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {

  currentUser = {
    firstname: '',
    lastname: '',
    profilepic: '../../../assets/images/noimage.png'
  }

  constructor(
    public authService: authService,
    public UserService: UserService
  ) { }

  ngOnInit() {

    if(localStorage.getItem('jwtToken')){
      var user = jwt_decode(localStorage.getItem('jwtToken'));
      this.UserService.getUser({id: user.id}).subscribe(
        data => {
          if(data.status == true){
            this.currentUser = data.data;

            if(this.currentUser.profilepic == undefined){
              this.currentUser.profilepic = '../../../assets/images/noimage.png'
            }
  
          }
        }
      )
    }

  }

}
