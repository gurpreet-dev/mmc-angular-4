import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import Swal from 'sweetalert2';
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-subscription-plans',
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.css']
})
export class SubscriptionPlansComponent implements OnInit {

  form: FormGroup;
  plans: FormArray;

  userinfo;

  constructor(
    public UserService: UserService,
    public formBuilder: FormBuilder
  ) {

    this.userinfo = jwt_decode(localStorage.getItem('jwtToken'));

    this.form = formBuilder.group({
      plans: this.formBuilder.array([])
    });

  }

  ngOnInit() {

    this.UserService.getUser({id:this.userinfo.id}).subscribe(
      data => {
        if(data.status == true){

          let ctrl = <FormArray>this.form.controls.plans;

          if(data.data.plans.length > 0){
            for(var i = 0; i< data.data.plans.length; i++){
              ctrl.push(this.formBuilder.group({
                title: data.data.plans[i].title,
                cost: [data.data.plans[i].cost, [Validators.required, Validators.pattern(/^[0-9]+\.?[0-9]*$/)]]
              }))
            }
          }else{

            var planss = ['weekly', 'monthly', 'yearly'];

            for(var i = 0; i < planss.length; i++){
              ctrl.push(this.formBuilder.group({
                title: planss[i],
                cost: ['0', [Validators.required, Validators.pattern(/^[0-9]+\.?[0-9]*$/)]]
              }))
            }

          }
        }else{
          Swal('Oops...', data.message, 'error')
        }
      },
      error => {
          console.log(error);
      }
    );
  }

  update(){
    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
    }else{
      console.log(this.form.value);
      this.form.value.user_id = this.userinfo.id;
      this.UserService.updatePlans(this.form.value).subscribe(
        data => {
          if(data.status == true){
            Swal("Success", data.message, "success");
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
