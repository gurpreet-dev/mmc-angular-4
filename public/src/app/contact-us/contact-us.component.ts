import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Http } from '@angular/http'
import { CommonService } from '../services/common.service';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  form: FormGroup;
  userinfo: any;
  userdata = {
    name: '',
    email: ''
  }

  constructor(
    public router: Router,
    public http: Http,
    public CommonService: CommonService,
    public UserService: UserService,
    public formBuilder : FormBuilder
  ) {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern("[^ @]*@[^ @]*")]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });

    if(localStorage.getItem('jwtToken')){

      this.userinfo = jwt_decode(localStorage.getItem('jwtToken'));

      this.UserService.getUser({id:this.userinfo.id}).subscribe(
        data => {
          if(data.status == true){
            this.form.patchValue({
              name: data.data.firstname+' '+data.data.lastname,
              email: data.data.email
            })
          }
        },
        error => {
            console.log(error);
        }
      );
    }

  }

  ngOnInit() {

    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
  });

  }

  save(){
    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
    }else{ 
      this.http.post(this.CommonService.base_url+'/contact/add', this.form.value)
      .map((response) => response.json())
      .subscribe(res => {
         if(res.status == true){
           Swal('Success', res.message, 'success');
           this.form.reset();
         }else{
            Swal('oops', res.message, 'error');
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
