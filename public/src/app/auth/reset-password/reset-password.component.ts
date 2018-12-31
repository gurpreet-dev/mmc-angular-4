import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2'
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  form: FormGroup;
  token;
  userinfo;

  constructor(
    private UserService: UserService,
    formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) {
    this.form = formBuilder.group({
      npass: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      cpass: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)], this.comparePassword.bind(this)]
    });
  }

  ngOnInit() {

    this.activatedRoute.params.subscribe(paramsId => {
      this.token = paramsId.token;
    });

    try{
      this.userinfo = jwt_decode(this.token);
    }catch(e){
      window.location.href = '/auth/login';
    }
  
    // if(this.userinfo.id){
    //   window.location.href = '/auth/login';
    // }

  }

  resetpassword() {

    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
    }else{

      this.form.value.user_id = this.userinfo.id;

      this.UserService.resetPassword(this.form.value).subscribe(
        data => {
            if(data.status == true){
              Swal({
                  title: "Success",
                  text: data.message,
                  type: "success"
              }).then(function() {
                  window.location.href = "/auth/login";
              });
            }else{
              Swal('Oops...', data.message, 'error')
            }
        },
        error => {
            console.log(error);
        }
      );
    }  

  }

  comparePassword(control: FormControl){
    return new Promise(resolve => {
      if ((control.root.get('npass').value != control.value)){
          resolve({
            passwordMismatch: true
          })
          } else {
            resolve(null);
          }
      })
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
