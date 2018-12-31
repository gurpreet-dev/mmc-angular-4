import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AdminService } from '../../services/admin.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css'],
  providers: [AdminService]
})
export class AdminLoginComponent implements OnInit {

  form: FormGroup;

  constructor(
    private router: Router,
    public AdminService: AdminService,
    public formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("[^ @]*@[^ @]*")]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  public login() {

    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
    }else{
      this.AdminService.login(this.form.value).subscribe(
        data => {
            if(data.status == true){
              localStorage.setItem('jwtToken', data.token);
              window.location.href = '/admin/dashboard';
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
