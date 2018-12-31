import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { VideoSubcategoryService } from '../../video-subcategory/video-subcategory.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

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

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public VideoSubcategoryService: VideoSubcategoryService
  ) {
    this.activatedRoute.params.subscribe(paramsId => {
      this.video_id = paramsId.id;
    });

    this.VideoSubcategoryService.getVideo({ id: this.video_id }).subscribe(
      data => {
        if(data.status == true){
          this.video = data.data[0];

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

}
