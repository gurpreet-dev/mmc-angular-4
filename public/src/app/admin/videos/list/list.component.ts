import { Component, OnInit } from '@angular/core';
import { VideoSubcategoryService } from '../../video-subcategory/video-subcategory.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  videos: any;

  constructor(public VideoSubcategoryService: VideoSubcategoryService) {  }

  ngOnInit() {

    this.list();

  }

  list(){
    this.VideoSubcategoryService.getAllVideos().subscribe(
      data => {
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
