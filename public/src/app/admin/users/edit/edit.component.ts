import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router, ActivatedRoute } from "@angular/router";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  form: FormGroup;

  user_id;
  email;

  roles = ['subscriber', 'channel'];
  genders = ['male', 'female'];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public UserService: UserService,
    public formBuilder: FormBuilder
  ) {
    this.activatedRoute.params.subscribe(paramsId => {
      this.user_id = paramsId.id;
    });

    this.form = formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      role: ['', [Validators.required]]
    });

  }

  ngOnInit() {

    this.UserService.getUser({id:this.user_id}).subscribe(
      data => {
        if(data.status == true){
          this.form.patchValue({
            firstname: data.data.firstname,
            lastname: data.data.lastname,
            phone: data.data.phone,
            dob: data.data.dob,
            gender: data.data.gender,
            role: data.data.role
          })
          this.email = data.data.email;
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
      this.form.value.user_id = this.user_id;
      this.UserService.update(this.form.value).subscribe(
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

  validateAllFormFields(formGroup: FormGroup) {         //{1}
    Object.keys(formGroup.controls).forEach(field => {  //{2}
      const control = formGroup.get(field);  
      console.log(control);           //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }  

}
