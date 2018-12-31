import { Component, OnInit } from '@angular/core';
import { VideoCategoryService } from '../admin/video-category/video-category.service';
import { VideoSubcategoryService } from '../admin/video-subcategory/video-subcategory.service';
import { UserService } from '../services/user.service';
import * as jwt_decode from "jwt-decode";
import { authService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  categories: any;
  onlinechannels: any;
  channels: any;
  trending_videos: any;
  userinfo = {
    role: '',
    id: ''
  };
  isLogged = false;
  subscribed_channels = [];

  constructor(
    public VideoCategoryService: VideoCategoryService,
    public VideoSubcategoryService: VideoSubcategoryService,
    public UserService: UserService,
    public authService: authService
  ) { }

  ngOnInit() {

    if(localStorage.getItem('jwtToken')){
      this.userinfo = jwt_decode(localStorage.getItem('jwtToken'));

      this.UserService.getSubscriptions({ user_id: this.userinfo.id }).subscribe(
        data => {
          if(data.status == true){
            for(var i = 0; i < data.data.length; i++){
              this.subscribed_channels.push(data.data[i].channel_id);
            }
          }
        }, error => {
          console.log(error);
        }
      )

    }

    this.isLogged = this.authService.isLoggedin();

    this.VideoCategoryService.front_list().subscribe(
      data => {
        if(data.status == true){
          this.categories = data.data;
        }
      }, error => {
        console.log(error);
      }
    )

    this.UserService.onlineUsers().subscribe(
      data => {
        if(data.status == true){
          this.onlinechannels = data.data;
        }
      }, error => {
        console.log(error);
      }
    )

    this.UserService.getChannels().subscribe(
      data => {
        if(data.status == true){
          this.channels = data.data;
        }
      }, error => {
        console.log(error);
      }
    )

    this.VideoSubcategoryService.getVideos().subscribe(
      data => {
        if(data.status == true){
          this.trending_videos = data.data;
        }
      }, error => {
        console.log(error);
      }
    )

  }

}
