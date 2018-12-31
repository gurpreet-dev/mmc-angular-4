import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  channel_id;
  video= {
    video: '',
    title: '',
    createdAt: '',
    views: 0,
    description: ''
  }

  videos;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public UserService: UserService
  ) {
    this.activatedRoute.params.subscribe(paramsId => {
      this.channel_id = paramsId.id;
    });

    this.latestVideo();
    this.latest5Videos();

  }

  ngOnInit() {
  }

  latestVideo(){
    this.UserService.latestVideo({ id: this.channel_id }).subscribe(
      data => {
        if(data.status == true){
          this.video = data.data[0].subcategories.videos
        }
      },error => {
        //this.router.navigate(['/']);
      }
    )
  }

  latest5Videos(){
    this.UserService.latest5Videos({ id: this.channel_id }).subscribe(
      data => {
        if(data.status == true){
          this.videos = data.data
        }
      },error => {
        //this.router.navigate(['/']);
      }
    )
  }

}
