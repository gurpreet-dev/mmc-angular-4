import { Component, OnInit } from '@angular/core';
import { VideoCategoryService } from '../../admin/video-category/video-category.service';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { UserService } from '../../services/user.service';
import { authService } from '../../auth/auth.service';
import * as jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {

  videos: any;
  channel_id;
  isLogged = false;
  currentUser: any;
  favorite_videos = []

  constructor(
    public VideoCategoryService: VideoCategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public UserService: UserService,
    public authService: authService
  ) {

    this.activatedRoute.params.subscribe(paramsId => {
      this.channel_id = paramsId.id;
    });

    this.isLogged = this.authService.isLoggedin();

    if(this.isLogged){
      this.getCurrentuser();
    }

  }

  ngOnInit() {

    this.getVideos();

  }

  getVideos(){
    this.VideoCategoryService.getUserVideos({ user_id: this.channel_id }).subscribe(
      data => {
        if(data.status == true){
          this.videos = data.data;
        }
      }, error => {
        console.log(error);
      }
    )
  } 

  getCurrentuser(){
      this.currentUser = jwt_decode(localStorage.getItem('jwtToken'));
      this.UserService.getUser({id: this.currentUser.id}).subscribe(
        data => {
          if(data.status == true){
            this.currentUser = data.data;  
            this.getFavoriteVideos();
          }
        }
      )
  }

  getFavoriteVideos(){
    this.UserService.getFavoriteVideos({ user_id: this.currentUser._id }).subscribe(
      data => {
        if(data.status == true){
          this.favorite_videos = [];
          for(var i = 0; i < data.data.length; i++ ){
            this.favorite_videos.push(data.data[i].subcategories.videos._id);
          }
        }
      }
    );
  }

  like(id){
    
    var data = {
      video_id : id,
      user_id : this.currentUser._id
    }

    this.UserService.likeVideo(data).subscribe(
      data => {

        if(data.status == true){
          this.getFavoriteVideos();
          this.getVideos();
        }
        
      }, error => {
        console.log(error);
      }
    )

  }

  unlikeVideo(id){
    var data = {
      video_id : id,
      user_id : this.currentUser._id
    }

      this.UserService.unlikeVideo(data).subscribe(
        data => {
  
          if(data.status == true){
            this.getFavoriteVideos();
            this.getVideos();
          }
          
        }, error => {
          console.log(error);
        }
      )
  }

}
