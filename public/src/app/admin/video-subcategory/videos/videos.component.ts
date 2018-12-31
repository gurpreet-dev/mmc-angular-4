import { Component, OnInit } from '@angular/core';
import { VideoSubcategoryService } from '../video-subcategory.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {

  videos: any;
  subcat_id;
  title = null;

  constructor(public VideoSubcategoryService: VideoSubcategoryService, private router: Router, private activatedRoute: ActivatedRoute,) {

    this.activatedRoute.params.subscribe(paramsId => {
      this.subcat_id = paramsId.id;
    });
  }

  ngOnInit() {
    this.list();
  }

  list(){

    this.VideoSubcategoryService.getSubcategoryVideosById({ id: this.subcat_id }).subscribe(
      data => {
        if(data.status == true){
          this.videos = data.data;
          this.title = data.data[0].data.title+'\'s';
           setTimeout(()=>{ 

            (<any>$("#example2")).DataTable({
                'paging': true,
                'lengthChange': false,
                'searching': true,
                'info': true,
                'autoWidth': false
              });  
          
          }, 1000); 
        }
      }, error => {
        console.log(error);
      }
    )
  }


}
