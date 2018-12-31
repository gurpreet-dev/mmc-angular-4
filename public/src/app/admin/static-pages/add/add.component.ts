import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import Swal from 'sweetalert2';
import { StaticPagesService } from '../static-pages.service';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  form: FormGroup;
  thumbnail;
  progressthumbnail_percentage = 0;
  progressthumbnail_color = '#488aff';
  ckeditorContent: string = '<p>Some html</p>'
  constructor(
    private router: Router,
    public http: Http,
    public StaticPagesService: StaticPagesService,
    public CommonService: CommonService,
    public formBuilder : FormBuilder
  	) { 

  	this.form = this.formBuilder.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]]
    });
    

  }

  ngOnInit() {
    
  }


  save(){

    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
    }else{ 

      this.form.value.slug = this.form.value.title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');

    this.http.post(this.CommonService.base_url+'/static-pages/add', this.form.value)
    .map((response) => response.json())
    .subscribe(res => {
      if(res.status == true){
              
          Swal({
            title: "Success",
            text: res.message,
            type: "success"
          }).then((function() {
            this.router.navigate(['/admin/static-pages']);
          }).bind(this));

          }else{
            Swal('Oops...', res.message, 'error')
          }
      }
    );



  }

  }



  validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }  

}
