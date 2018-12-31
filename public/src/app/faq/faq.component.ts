import { Component, OnInit } from '@angular/core';
import { FaqService } from '../services/faq.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  faqs: any;

  constructor(
    public FaqService: FaqService
  ) { }

  ngOnInit() {

    this.FaqService.list().subscribe(
      data => {
        if(data.status == true){
          this.faqs = data.data;
        }
      }
    )

  }

}
