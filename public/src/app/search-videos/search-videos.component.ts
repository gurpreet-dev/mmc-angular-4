import { Component, OnInit } from '@angular/core';
import { VideoCategoryService } from '../admin/video-category/video-category.service';
import { VideoSubcategoryService } from '../admin/video-subcategory/video-subcategory.service';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-search-videos',
  templateUrl: './search-videos.component.html',
  styleUrls: ['./search-videos.component.css']
})
export class SearchVideosComponent implements OnInit {

  categories: any;
  subcat = {
    title: ''
  };
  term;
  video_count = null;
  videos: any;

  constructor(
    public VideoCategoryService: VideoCategoryService,
    public VideoSubcategoryService: VideoSubcategoryService,
    private activatedRoute: ActivatedRoute,
    public router: Router
  ) {
    
    this.activatedRoute.params.subscribe(paramsId => {
      this.term = paramsId.term;
    });


    this.VideoCategoryService.front_list().subscribe(
      data => {
        if(data.status == true){
          this.categories = data.data;
        }
      }, error => {
        console.log(error);
      }
    )

    this.VideoSubcategoryService.searchVideos({ term: this.term }).subscribe(
      data => {
        if(data.status == true){
          this.videos = data.data;
          this.video_count = data.data.length;
        }else{
          this.video_count = 0;
        }
      }, error => {
        console.log(error);
      }
    )

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  }

  ngOnInit() {

    
  }

}
