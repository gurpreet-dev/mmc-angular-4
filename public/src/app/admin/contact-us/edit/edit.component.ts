import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { Http } from '@angular/http';
import Swal from 'sweetalert2';
import { CommonService } from '../../../services/common.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  form: FormGroup;
  contact_id;	
  contact: any;

  constructor(
    private router: Router,
    public http: Http,
    public CommonService: CommonService,
    public formBuilder : FormBuilder,
    public activatedRoute: ActivatedRoute
  	) { 

  	this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: [{value: '', disabled: true}, [Validators.required]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]],
      reply: ['', [Validators.required]]
    });

    this.activatedRoute.params.subscribe(paramsId => {
      this.contact_id = paramsId.id;
    });
    

  }

  ngOnInit() {

    this.getContact();
  	
  }

  getContact(){
    this.http.get(this.CommonService.base_url+'/contact/get/'+this.contact_id)
    .map((response) => response.json())
    .subscribe(res => {
      if(res.status == true){
        this.form.patchValue({
          name: res.data.name,
          email: res.data.email,
          subject: res.data.subject,
          message: res.data.message,
          reply: res.data.reply
        })

        this.contact = res.data;

      }else{
        Swal({
          title: "oops",
          text: res.message,
          type: "error"
        }).then((function() {
          this.router.navigate(['/admin/contact-us']);
        }).bind(this));
      }
      }
    );
  }


  save(){

    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
    }else{ 

      this.form.value.id = this.contact_id;
      this.form.value.email = this.contact.email;

      this.http.post(this.CommonService.base_url+'/contact/edit/', this.form.value)
      .map((response) => response.json())
      .subscribe(res => {
        if(res.status == true){
          Swal({
            title: "Success",
            text: res.message,
            type: "success"
          }).then((function() {
            this.router.navigate(['/admin/contact-us']);
          }).bind(this));
        }else{
          Swal("oops", res.message, "error" );
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
