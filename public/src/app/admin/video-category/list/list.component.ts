import { Component, OnInit } from '@angular/core';
import { VideoCategoryService } from '../video-category.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  categories: any;

  constructor(public VideoCategoryService: VideoCategoryService) {

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
    this.VideoCategoryService.list().subscribe(
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
    this.VideoCategoryService.delete(id).subscribe(
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
