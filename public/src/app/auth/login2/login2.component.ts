import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { authService } from '../auth.service';  
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'login2',
  templateUrl: './login2.component.html',
  styleUrls: ['./login2.component.css'],
  providers: [authService]
})
export class Login2Component {
  form: FormGroup;  
  channel_id;  

  constructor(
    private router: Router, 
    private http: Http,
    formBuilder: FormBuilder,
    public UserService: UserService,
    private _authService: authService,
    public activatedRoute: ActivatedRoute
  ) {
    this.form = formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("[^ @]*@[^ @]*")]],
      password: ['', Validators.required]
    });

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(){

    this.activatedRoute.params.subscribe(paramsId => {
      this.channel_id = paramsId.channel_id;
    });

  }


  public login() {

    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
    }else{
      this.UserService.login(this.form.value).subscribe(
        data => {
            if(data.status == true){
              localStorage.setItem('jwtToken', data.token);
              window.location.href = '/channel/subscribe/'+this.channel_id;
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
