import { Component, OnInit } from '@angular/core';

import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  users: any;

  constructor(
    public _UserService: UserService
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

    this._UserService.allUsers().subscribe(
      data => {
         if(data.status == true){
           this.users = data.data;
         }
      },
      error => {
          console.log(error);
      }
    );

  }

}

interface JQuery {  
  DataTable():void;
}
