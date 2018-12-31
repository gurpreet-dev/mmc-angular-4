import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  form: FormGroup;
  button = 'Send';

  constructor(private router: Router, 
    private http: Http,
    formBuilder: FormBuilder,
    public UserService: UserService) {
      this.form = formBuilder.group({
        email: ['', [Validators.required, Validators.pattern("[^ @]*@[^ @]*")]]
      });
    }

  ngOnInit() {
  }

  submit(){

    this.button = 'Please wait...'

    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
    }else{
      this.UserService.forgotPassword(this.form.value).subscribe(
        data => {
            if(data.status == true){
              this.form.reset();
              Swal('Success', data.message, 'success')
            }else{
              Swal('Oops...', data.message, 'error')
            }

            this.button = 'Send';
        },
        error => {
            console.log(error);
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
