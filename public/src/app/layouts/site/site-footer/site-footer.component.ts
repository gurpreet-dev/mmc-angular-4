import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Http, Headers } from '@angular/http';
import { Router } from "@angular/router";

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.component.html',
  styleUrls: ['./site-footer.component.css']
})
export class SiteFooterComponent implements OnInit {

  pages: any;

  constructor(
    public CommonService: CommonService,
    public http: Http,
    public router: Router
  ) {
    let headers = new Headers();
    headers.append('Content-Type','application/json');

    this.http.get(this.CommonService.base_url+'/static-pages/list', {headers: headers}).
      map((response) => response.json()).
      subscribe((data) => {
        if(data.status == true){
          this.pages = data.data;
        }
    })

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  }

  ngOnInit() {
  }

}
