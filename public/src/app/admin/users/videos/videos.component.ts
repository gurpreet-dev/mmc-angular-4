import { Component, OnInit } from '@angular/core';
import { VideoCategoryService } from '../../video-category/video-category.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {

  videos: any;
  user_id;

  constructor(
    public VideoCategoryService: VideoCategoryService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.params.subscribe(paramsId => {
      this.user_id = paramsId.id;
    });

  }

  ngOnInit() {

    this.list();

  }

  list(){

    var data = {
      user_id: this.user_id
    }

    this.VideoCategoryService.getUserVideos(data).subscribe(
      data => {
        console.log(data);
        if(data.status == true){
          this.videos = data.data;
           this.paginate();
        }else{
          this.paginate();
        }
      }, error => {
        console.log(error);
      }
    )
  }

  paginate(){
    setTimeout(()=>{ 

      (<any>$("#example2")).DataTable({
          'paging': true,
          'lengthChange': false,
          'searching': true,
          'ordering': true,
          'info': true,
          'autoWidth': false
        });  
    
    }, 1000);
  }

}
