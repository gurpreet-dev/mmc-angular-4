import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { UserService } from '../../services/user.service';
import { authService } from '../../auth/auth.service';
import * as jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {

  album_id;
  photos: any;
  channel_id;
  isLogged = false;
  currentUser: any;
  favorite_photos = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    public UserService: UserService,
    public authService: authService
  ) {
    this.activatedRoute.params.subscribe(paramsId => {
      this.album_id = paramsId.albumid;
      this.channel_id = paramsId.id;
    });

    this.isLogged = this.authService.isLoggedin();

    if(this.isLogged){
      this.getCurrentuser();
    }

    this.getPhotos();

  }

  ngOnInit() {
  }

  getPhotos(){

    var data = {
      id: this.album_id
    }

    this.UserService.getAlbumPhotos(data).subscribe(
      data => {

        if(data.status == true){
         this.photos = data.data.images;
        }
        
      }, error => {
        console.log(error);
      }
    )
  }

  previewImage(src){
    var modal = document.getElementById('myModal');
    var modalImg = document.getElementById("img01") as HTMLInputElement;
        modal.style.display = "flex";
        modalImg.src = src;
  }

  close(){
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
  }


  getCurrentuser(){
    var user = jwt_decode(localStorage.getItem('jwtToken'));
      this.UserService.getUser({id: user.id}).subscribe(
        data => {
          if(data.status == true){
            this.currentUser = data.data; 
            this.getFavoritePhotos(); 
            console.log(this.currentUser);
          }
        }
      )
  }

  getFavoritePhotos(){
    this.UserService.getFavoritePhotos({ user_id: this.currentUser._id }).subscribe(
      data => {
        if(data.status == true){
          this.favorite_photos = [];
          for(var i = 0; i < data.data.length; i++ ){
            this.favorite_photos.push(data.data[i].albums.images._id);
          }
          console.log('favorite_photos', this.favorite_photos)
        }
      }
    );
  }

  like(id){
    
    var data = {
      image_id : id,
      user_id : this.currentUser._id
    }

    this.UserService.likePhoto(data).subscribe(
      data => {

        if(data.status == true){
          this.getFavoritePhotos();
          this.getPhotos();
        }else{
          Swal('oops', data.message, 'error');
        }
        
      }, error => {
        console.log('like_error', error);
      }
    )

  }

  unlikePhoto(id){
    var data = {
      image_id : id,
      user_id : this.currentUser._id
    }

    this.UserService.unlikePhoto(data).subscribe(
      data => {

        if(data.status == true){
          this.getFavoritePhotos();
          this.getPhotos();
        }
        
        
      }, error => {
        console.log(error);
      }
    )

  }

}


