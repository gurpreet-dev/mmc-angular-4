import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent implements OnInit {

  channel_id;
  albums: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private UserService: UserService,
  ) { 
    this.activatedRoute.params.subscribe(paramsId => {
      this.channel_id = paramsId.id;
    });

    this.allAlbums();

  }

  ngOnInit() {
  }

  allAlbums(){

    var data = {
      user_id: this.channel_id
    }

    this.UserService.getAlbums(data).subscribe(
      data => {

        if(data.status == true){
         this.albums = data.data.albums;
        }
        
      }
    )
  }

}
