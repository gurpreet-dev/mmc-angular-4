import { Component, OnInit } from '@angular/core';
import { VideoCategoryService } from '../admin/video-category/video-category.service';
import { VideoSubcategoryService } from '../admin/video-subcategory/video-subcategory.service';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categories: any;
  subcat = {
    title: ''
  };
  slug;
  video_count = null;
  videos: any;

  constructor(
    public VideoCategoryService: VideoCategoryService,
    public VideoSubcategoryService: VideoSubcategoryService,
    private activatedRoute: ActivatedRoute,
    public router: Router
  ) {
    
    this.activatedRoute.params.subscribe(paramsId => {
      this.slug = paramsId.slug;
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

    var info = {
      slug: this.slug
    }

    this.VideoSubcategoryService.getSubcategoryVideos(info).subscribe(
      data => {
        if(data.status == true){
          this.subcat = data.data[0].subcategories;
          this.videos = data.data[0].subcategories.videos;

          if(data.data[0].subcategories.videos == 'undefined' || data.data[0].subcategories.videos == undefined){
            this.video_count = 0;
          }else{
            this.video_count = data.data[0].subcategories.videos.length;
          }

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
