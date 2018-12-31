import { Component, OnInit } from '@angular/core';
import { SubscriptionPlansService } from '../../../services/subscription-plans.service';
import Swal from 'sweetalert2';
import { Router } from "@angular/router";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  plans: any;

  constructor(
    public SubscriptionPlansService: SubscriptionPlansService,
    private router: Router
  ) {
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
    this.SubscriptionPlansService.list().subscribe(
      data => {
          if(data.status == true){
            this.plans = data.data
          }else{
            Swal('Oops...', data.message, 'error')
          }
      },
      error => {
          console.log(error);
      }
    );
  }

  delete(id){
    this.SubscriptionPlansService.delete(id).subscribe(
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
