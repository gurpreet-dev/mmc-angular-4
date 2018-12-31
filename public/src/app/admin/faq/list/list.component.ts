import { Component, OnInit } from '@angular/core';
import { FaqService } from '../../../services/faq.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  faqs: any;

  constructor(
    public FaqService: FaqService
  ) {}

  ngOnInit() {

    this.getFaqs();

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

  getFaqs(){
    this.FaqService.list().subscribe(
      data => {
        if(data.status == true){
          this.faqs = data.data;
        }
      }, error => {

      }
    )
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
        this.FaqService.delete({ id: id }).subscribe(
          data => {
            if(data.status == true){
              this.getFaqs();
            }
          }, error => {
    
          }
        )
      }
    });

  }

}
