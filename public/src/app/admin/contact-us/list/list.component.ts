import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http'
import { CommonService } from '../../../services/common.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  contacts: any;

  constructor(
    public CommonService: CommonService,
    public http: Http
  ) {}

  ngOnInit() {

    this.getContacts();

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

  getContacts(){
    this.http.get(this.CommonService.base_url+'/contact')
      .map((response) => response.json())
      .subscribe(res => {
         if(res.status == true){
           this.contacts = res.data;
         }
        }
      );
  }

  delete(id){

      Swal({
        title: 'Are you sure?',
        text: "You want to delete this faq!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          this.http.post(this.CommonService.base_url+'/contact/delete', { id: id })
          .map((response) => response.json())
          .subscribe(res => {
            if(res.status == true){
              this.getContacts();
            }
            }
          );
        }
      });
  }


}
