import { Component, OnInit } from '@angular/core';
import { VideoSubcategoryService } from '../video-subcategory.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  categories: any;

  constructor(public VideoSubcategoryService: VideoSubcategoryService) {

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

  ngOnInit() {

    this.list();

  }

  list(){
    this.VideoSubcategoryService.list().subscribe(
      data => {
        if(data.status == true){
          this.categories = data.data;
        }
      }, error => {
        console.log(error);
      }
    )
  }

  delete(id){
    this.VideoSubcategoryService.delete(id).subscribe(
      data => {
          if(data.status == true){
            this.list();
            Swal('Success', data.message, 'success')
          }else{
            Swal('Oops...', data.message, 'error')
          }
      },
      error => {
          console.log(error);
      }
    );
  }

}
