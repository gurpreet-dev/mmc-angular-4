import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {

  album_id;
  photos: any;
  album_title;
  image_count= null;

  constructor(
    public UserService: UserService,
    private activatedRoute: ActivatedRoute
  ) {

    this.activatedRoute.params.subscribe(paramsId => {
      this.album_id = paramsId.id;
    });

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
         this.album_title = data.data.title;
         this.image_count = data.data.images.length;
        }else{
          this.image_count = 0;
        }
        
      }, error => {
        console.log(error);
      }
    )
  }

}
