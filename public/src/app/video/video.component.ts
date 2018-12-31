import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { VideoSubcategoryService } from '../admin/video-subcategory/video-subcategory.service';
import { UserService } from '../services/user.service';
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css']
})
export class VideoComponent implements OnInit {

  video_id;
  video= {
    subcategories: {
      videos: {
        video: '',
        title: '',
        createdAt: '',
        views: 0,
        description: '',
        duration: '',
        size: 0
      }
    }
  }

  countviews = 0;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public VideoSubcategoryService: VideoSubcategoryService,
    public UserService: UserService
  ) {
    this.activatedRoute.params.subscribe(paramsId => {
      this.video_id = paramsId.id;
    });

    this.VideoSubcategoryService.getVideo({ id: this.video_id }).subscribe(
      data => {
        if(data.status == true){

          this.checkSubscription(data.data[0]).then(
            res => {
              this.video = data.data[0];
            }
          );

          // this.checkSubscription(data.data[0]);

          // this.video = data.data[0];
          this.getViews(data);
          this.addView(data);

        }else{
          this.router.navigate(['/']);
        }
      }, error => {
        this.router.navigate(['/']);
      }
    )

    

  }

  ngOnInit() {
    
  }

  checkSubscription(data){
    return new Promise((resolve, reject) => {
      if(localStorage.getItem('jwtToken')){
        var userinfo = jwt_decode(localStorage.getItem('jwtToken'));
        this.UserService.checkSubscribed({ user_id: userinfo.id, channel_id: data.subcategories.videos.user_id }).subscribe(
          data2 => {
            if(data2.status == false){
              this.router.navigate(['/channel/subscribe/'+data.subcategories.videos.user_id]);
            }
            resolve();
          }
        )
      }else{
        this.router.navigate(['/auth/login']);
      }
    });
  }

  getViews(data){

    var info = {
      video_id : data.data[0].subcategories.videos._id,
    }

    this.VideoSubcategoryService.getViews(info).subscribe(
      data => {
        if(data.status == true){
          this.countviews = data.data.views;
        }
      }, error => {
        console.log(error);
      }
    );
  }

  addView(data){

    
    setTimeout(()=>{

      var info = {
        video_id : data.data[0].subcategories.videos._id,
      }

      this.VideoSubcategoryService.addView(info).subscribe(
        data1 => {
          this.getViews(data)
        }, error => {
          console.log(error);
        }
      );
    }, 5000 )
  }

  back(){
    
  }

}
