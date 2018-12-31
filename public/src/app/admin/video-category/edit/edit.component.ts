import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from "@angular/router";
import { VideoCategoryService } from '../video-category.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  form: FormGroup;
  cat_id;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
    public VideoCategoryService: VideoCategoryService
  ) {
    this.form = formBuilder.group({
      title: ['', [Validators.required]],
      status: ['']
    });

    this.activatedRoute.params.subscribe(paramsId => {
      this.cat_id = paramsId.id;
    });

    this.getCat();
  }

  ngOnInit() {
  }

  getCat(){
    this.VideoCategoryService.get(this.cat_id).subscribe(
      data => {
        if(data.status == true){
          this.form.patchValue({
            title: data.data.title,
            status: data.data.status
          })

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
      this.form.value.id = this.cat_id;
   
      this.VideoCategoryService.edit(this.form.value).subscribe(
        data => {
            if(data.status == true){
              Swal({
                title: "Success",
                text: data.message,
                type: "success"
              }).then((function() {
                this.router.navigate(['/admin/video-categories']);
              }).bind(this));
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
