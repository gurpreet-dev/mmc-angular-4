import { Component, OnInit } from '@angular/core';
import { AuctionService } from '../../../services/auction.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  auctions: any;

  constructor(
    public AuctionService: AuctionService
  ) {}

  ngOnInit() {

    this.getAuctions();

  }

  getAuctions(){
    this.AuctionService.list().subscribe(
      data => {
        if(data.status == true){
          this.auctions = data.data;
        }
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
      }, error => {

      }
    )
  }

  
}
