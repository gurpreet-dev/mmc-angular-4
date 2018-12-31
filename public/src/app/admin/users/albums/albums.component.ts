import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent implements OnInit {

  users: any;
  albums: any;
  user_id;
  userinfo = {
    name: '',
    id: ''
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public UserService: UserService
  ) {

    this.activatedRoute.params.subscribe(paramsId => {
      this.user_id = paramsId.id;
    });

   }

  ngOnInit() {

    this.allAlbums();

  }

  allAlbums(){

    var data = {
      user_id: this.user_id
    }

    this.UserService.getAlbums(data).subscribe(
      data => {

        if(data.status == true){
         this.albums = data.data.albums;
         this.userinfo.name = data.data.firstname+' '+data.data.lastname;
         this.userinfo.id = data.data._id;
        }

        this.paginate();
        
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
          'ordering': false,
          'info': true,
          'autoWidth': false
        });  
    
     }, 1000);
  }

}
