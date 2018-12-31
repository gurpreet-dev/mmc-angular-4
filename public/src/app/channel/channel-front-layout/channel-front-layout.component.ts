import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { UserService } from '../../services/user.service';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import * as jwt_decode from "jwt-decode";
import { authService } from '../../auth/auth.service';

@Component({
  selector: 'app-channel-front-layout',
  templateUrl: './channel-front-layout.component.html',
  styleUrls: ['./channel-front-layout.component.css']
})
export class ChannelFrontLayoutComponent implements OnInit {

  channel_id;
  currentUser = {
    profilepic: '../../assets/images/noimage.png',
    bannerpic: '../../assets/images/nobanner.png',
    firstname: '',
    lastname: '',
    subscribers: 0
  };

  userinfo = {
    role: '',
    id: ''
  };
  subscribed = false;
  isLogged = false;

  public showBanner:boolean = true;
  public showProfile:boolean = true;
  routeEvents$;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public UserService: UserService,
    public authService: authService
  ) {

    // this.activatedRoute.params.subscribe(paramsId => {
    //   this.channel_id = paramsId.id;
    // });
    
    this.routeEvents$ = this.router.events.subscribe(

      ( $routeEvents ) : void => {
 
         if ( $routeEvents instanceof NavigationEnd ) {
 
             if(typeof this.activatedRoute.firstChild != "undefined" && this.activatedRoute.firstChild){
 
                 //console.log(this.activatedRoute.firstChild.snapshot.params, 'In parent');


                 this.channel_id = this.activatedRoute.firstChild.snapshot.params.id;

                 this.getUser();
 
             }
 
         }
 
      });

  }

  ngOnInit() {
    if(localStorage.getItem('jwtToken')){

      this.userinfo = jwt_decode(localStorage.getItem('jwtToken'));

      this.UserService.checkSubscribed({ user_id: this.userinfo.id, channel_id: this.channel_id }).subscribe(
        data2 => {
          if(data2.status == true){
            this.subscribed = true;
          }
        }
      )

    }

    this.isLogged = this.authService.isLoggedin();
  }

  getUser(){
    this.UserService.getUser({id: this.channel_id}).subscribe(
      data => {
        if(data.status == true){
          this.currentUser = data.data

          if(this.currentUser.profilepic == undefined){
            this.currentUser.profilepic = '../../assets/images/noimage.png';
          }

          if(this.currentUser.bannerpic == undefined){
            this.currentUser.bannerpic = '../../assets/images/nobanner.png';
          }

        }else{
          this.router.navigate(['/']);
        }
      },error => {
        this.router.navigate(['/']);
      }
    )

    setTimeout(() => {
      this.showBanner = false;
      this.showProfile = false;
    }, 4000);
  }

}
