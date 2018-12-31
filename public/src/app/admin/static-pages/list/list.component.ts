import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { Http, Headers } from '@angular/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  pages: any;

  constructor(
    public CommonService: CommonService,
    public http: Http
  ) { }

  ngOnInit() {

    this.list();
  }

  list(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');

    this.http.get(this.CommonService.base_url+'/static-pages/list', {headers: headers}).
      map((response) => response.json()).
      subscribe((data) => {
        if(data.status == true){
          this.pages = data.data;
        }
        this.paginate();
    })

  }

  paginate(){
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

}
