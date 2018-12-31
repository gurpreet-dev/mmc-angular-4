import { Component, OnInit } from '@angular/core';
import { VideoCategoryService } from '../../../../admin/video-category/video-category.service';
import * as jwt_decode from "jwt-decode";
import {TimeAgoPipe} from 'time-ago-pipe';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {

  videos: any;
  userinfo;

  constructor(
    public VideoCategoryService: VideoCategoryService
  ) { }

  ngOnInit() {

    var userinfo = jwt_decode(localStorage.getItem('jwtToken'));

    var data = {
      user_id: userinfo.id
    }

    this.VideoCategoryService.getUserVideos(data).subscribe(
      data => {
        
        if(data.status == true){
          this.videos = data.data;
        }
      }, error => {
        console.log(error);
      }
    )
  }

}
