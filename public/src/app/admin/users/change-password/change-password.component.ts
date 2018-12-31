import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from "@angular/router";
import { Http } from '@angular/http';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  form: FormGroup;
  user_id;

  constructor(
    private router: Router, 
    private http: Http,
    private UserService: UserService,
    private activatedRoute: ActivatedRoute,
    formBuilder: FormBuilder
  ) {
      this.form = formBuilder.group({
        npass: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
        cpass: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)], this.comparePassword.bind(this)]
      });

      this.activatedRoute.params.subscribe(paramsId => {
        this.user_id = paramsId.id;
      });
    }

  ngOnInit() {
  }

  changepassword() {

    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
    }else{
      this.form.value.user_id = this.user_id;
      this.UserService.changePassword(this.form.value).subscribe(
        data => {
            if(data.status == true){
              Swal({
                title: "Success",
                text: data.message,
                type: "success"
              }).then(() => {
                this.router.navigate(['/admin/users']);
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
