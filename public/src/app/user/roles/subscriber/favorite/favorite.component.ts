import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import * as jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {

  currentUser: any;
  photos: any;
  videos: any;

  constructor(
    public UserService: UserService
  ) { 
    this.currentUser = jwt_decode(localStorage.getItem('jwtToken'));
  }

  ngOnInit() {

    this.getPhotos();
    this.getVideos();

  }

  getPhotos(){
    this.UserService.getFavoritePhotos({ user_id: this.currentUser.id }).subscribe(
      data => {
        if(data.status == true){
          this.photos = data.data;
        }
      }
    );
  }

  getVideos(){
    this.UserService.getFavoriteVideos({ user_id: this.currentUser.id }).subscribe(
      data => {
        if(data.status == true){
          this.videos = data.data;
        }
      }
    );
  }

  unlikePhoto(id){
    var data = {
      image_id : id,
      user_id : this.currentUser.id
    }

    Swal({
      title: 'Are you sure?',
      text: "You want to unfavorite this image!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.value) {
        this.UserService.unlikePhoto(data).subscribe(
          data => {
    
            if(data.status == true){
              this.getPhotos();
              Swal('Success', data.message, 'success');
            }else{
              Swal('oops', data.message, 'error');
            }
            
          }, error => {
            console.log(error);
          }
        )
      }
    });

  }

  unlikeVideo(id){
    var data = {
      video_id : id,
      user_id : this.currentUser.id
    }

    Swal({
      title: 'Are you sure?',
      text: "You want to unfavorite this video!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.value) {
        this.UserService.unlikeVideo(data).subscribe(
          data => {
    
            if(data.status == true){
              this.getVideos();
              Swal('Success', data.message, 'success');
            }else{
              Swal('oops', data.message, 'error');
            }
            
          }, error => {
            console.log(error);
          }
        )
      }
    });
  }

}
