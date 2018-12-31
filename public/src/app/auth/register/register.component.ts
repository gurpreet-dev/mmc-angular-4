import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import { authService } from '../auth.service'; 
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers: [authService, UserService] 
})
export class RegisterComponent {
  form: FormGroup;
  roles: string[] = ['user', 'channel'];

  constructor(
    private router: Router, 
    private http: Http,
    private _authService: authService,
    public UserService: UserService,
    formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern("[^ @]*@[^ @]*")]],
      phone: ['', Validators.required], 
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      cpassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)], this.comparePassword.bind(this)],
      dob: ['', Validators.required],
      role: ['', Validators.required],
      tandc: ['', Validators.required]
    });

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(){
    
  }


  public save() {
    this.createUser(this.form.value);
  }

  createUser(data){

    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
    }else{
      this.UserService.register(data).subscribe(
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
      if ((control.root.get('password').value != control.value)){
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
