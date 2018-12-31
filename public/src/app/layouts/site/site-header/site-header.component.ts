import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";
import { authService } from '../../../auth/auth.service';
import { UserService } from '../../../services/user.service';
import * as jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.css'],
  providers: [authService]
})
export class SiteHeaderComponent implements OnInit {

  isLogged;
  currentUser;
  term;

  constructor(public authService: authService, public UserService: UserService, public router: Router) { }

  ngOnInit() {

    this.isLogged = this.authService.isLoggedin();

    if(localStorage.getItem('jwtToken')){
      this.currentUser = jwt_decode(localStorage.getItem('jwtToken'));
      this.UserService.getUser({id: this.currentUser.id}).subscribe(
        data => {
          if(data.status == true){
            this.currentUser = data.data;
  
          }else{
            Swal('Oops', 'Please login again to continue!', 'error');
          }
        },error => {
          Swal('Oops', 'Please login again to continue!', 'error');
        }
      )
    }


  }

  onClickSubmit(data) {

    if(data.term != undefined && data.term != ''){
      this.router.navigate(['/search/'+data.term]);
    }

  }

  logout(){
    this.authService.logout();
  }

  redirect(url){
      window.location.href = url;
  }

}
