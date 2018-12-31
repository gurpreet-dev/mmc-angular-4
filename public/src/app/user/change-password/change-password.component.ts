import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  providers: [UserService]
})
export class ChangePasswordComponent implements OnInit {

  form: FormGroup;

  constructor(
    private router: Router, 
    private http: Http,
    private UserService: UserService,
    formBuilder: FormBuilder,) {
      this.form = formBuilder.group({
        opass: ['', [Validators.required]],
        npass: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
        cpass: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)], this.comparePassword.bind(this)]
      });
    }

  ngOnInit() {
  }

  changepassword() {

    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
    }else{
      this.UserService.changePassword(this.form.value).subscribe(
        data => {
            if(data.status == true){
              Swal('Success', data.message, 'success')
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
