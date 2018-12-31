import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  subscriptions: any;

  constructor(
    public _UserService: UserService
  ) {
    this._UserService.allSubscriptions().subscribe(
      data => {
         if(data.status == true){
           this.subscriptions = data.data;
           setTimeout(()=>{ 

            (<any>$("#example2")).DataTable({
                'paging': true,
                'lengthChange': false,
                'searching': true,
                'ordering': false,
                'info': true,
                'autoWidth': false
              });  
          
           }, 1000);
         }
      },
      error => {
          console.log(error);
      }
    );
  }

  ngOnInit() {
  }

}
