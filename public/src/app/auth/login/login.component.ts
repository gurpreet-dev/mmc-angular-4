import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { authService } from '../auth.service';  
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [authService]
})
export class LoginComponent {
  form: FormGroup;    

  constructor(
    private router: Router, 
    private http: Http,
    formBuilder: FormBuilder,
    public UserService: UserService,
    private _authService: authService
  ) {
    this.form = formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("[^ @]*@[^ @]*")]],
      password: ['', Validators.required]
    });

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(){}


  public login() {

    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
    }else{
      this.UserService.login(this.form.value).subscribe(
        data => {
            if(data.status == true){
              localStorage.setItem('jwtToken', data.token);
              window.location.href = '/';
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
