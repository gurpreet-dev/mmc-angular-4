import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { Http, Headers } from '@angular/http';
import Swal from 'sweetalert2';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  form: FormGroup;
  page_id;		

  constructor(
    private router: Router,
    public http: Http,
    public formBuilder : FormBuilder,
    public activatedRoute: ActivatedRoute,
    public CommonService: CommonService
  	) { 

  	this.form = this.formBuilder.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      status: ['']
    });

    this.activatedRoute.params.subscribe(paramsId => {
      this.page_id = paramsId.id;
    });
    

  }

  ngOnInit() {

    this.getPage();
  	
  }

  getPage(){
    let headers = new Headers();
    headers.append('Content-Type','application/json');

    this.http.get(this.CommonService.base_url+'/static-pages/get/'+this.page_id, {headers: headers}).
      map((response) => response.json()).
      subscribe((data) => {
        if(data.status == true){
          this.form.patchValue({
            title: data.data.title,
            content: data.data.content,
            status: data.data.status
          })

        }else{
          Swal({
            title: "oops",
            text: data.message,
            type: "error"
          }).then((function() {
            this.router.navigate(['/admin/static-pages']);
          }).bind(this));
        }
    })
  }


  save(){

    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
    }else{ 

      this.form.value.id = this.page_id;
      this.form.value.slug = this.form.value.title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
      
      this.http.post(this.CommonService.base_url+'/static-pages/edit', this.form.value)
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
