import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import { Router } from "@angular/router";
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-subscribed-channels',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './subscribed-channels.component.html',
  styleUrls: ['./subscribed-channels.component.css']
})
export class SubscribedChannelsComponent implements OnInit {

  userinfo: any;
  subscriptions: any;

  constructor(
    public UserService: UserService,
  ) { }

  ngOnInit() {
    this.userinfo = jwt_decode(localStorage.getItem('jwtToken'));

    this.UserService.listUserSubscriptions({ user_id: this.userinfo.id }).subscribe(
      data => {
        console.log(data)
        if(data.status = true){
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
      }, error => {

      }
    )
  }

}
