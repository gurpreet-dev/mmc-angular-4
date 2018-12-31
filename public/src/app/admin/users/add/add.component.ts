import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import Swal from 'sweetalert2';
import { Router } from "@angular/router";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  form: FormGroup;

  roles = ['channel', 'subscriber'];

  constructor(
    public UserService: UserService,
    private router: Router,
    public formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern("[^ @]*@[^ @]*")]],
      phone: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      role: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
    });
  }

  ngOnInit() {

  }

  addUser(){
    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
    }else{
      this.UserService.register(this.form.value).subscribe(
        data => {
          if(data.status == true){
            Swal({
              title: "Success",
              text: data.message,
              type: "success"
            }).then(function() {
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
      const control = formGroup.get(field);             //{3}
      if (control instanceof FormControl) {             //{4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        //{5}
        this.validateAllFormFields(control);            //{6}
      }
    });
  }  

}
