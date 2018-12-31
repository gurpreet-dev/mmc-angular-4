import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { Http, Headers } from '@angular/http';
import { CommonService } from '../services/common.service';

@Component({
  selector: 'app-static-pages',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './static-pages.component.html',
  styleUrls: ['./static-pages.component.css']
})
export class StaticPagesComponent implements OnInit {

  slug;
  page = {
    title: '',
    content: ''
  }

  constructor(
    private router: Router,
    public http: Http,
    public activatedRoute: ActivatedRoute,
    public CommonService: CommonService

  ) {

    this.activatedRoute.params.subscribe(paramsId => {
      this.slug = paramsId.slug;
    });

  }

  ngOnInit() {

    let headers = new Headers();
    headers.append('Content-Type','application/json');

    this.http.get(this.CommonService.base_url+'/static-pages/get_by_slug/'+this.slug, {headers: headers}).
      map((response) => response.json()).
      subscribe((data) => {
        console.log(data)
        if(data.status == true){
          this.page = data.data;

        }
    })

  }

}
