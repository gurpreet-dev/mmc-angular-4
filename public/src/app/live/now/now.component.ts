import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { UserService } from '../../services/user.service';
import { VideoCategoryService } from '../../admin/video-category/video-category.service';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-now',
  templateUrl: './now.component.html',
  styleUrls: ['./now.component.scss'],
  providers: [UserService]
})
export class NowComponent {


  users: any;
  categories: any;
  count = null;

  constructor(
    private router: Router, 
    private http: Http,
    private _userService: UserService,
    public VideoCategoryService: VideoCategoryService
  ) {}

  ngOnInit(){   

    this.VideoCategoryService.front_list().subscribe(
      data => {
        if(data.status == true){
          this.categories = data.data;
        }
      }, error => {
        console.log(error);
      }
    )

    this._userService.getOnlineUsers().subscribe(
      data => {
         if(data.status == true){
           this.users = data.data;
           this.count = data.data.length;
         }else{
            this.count = 0;
         }
      },
      error => {
          console.log(error);
      }
    );

  }

}
