import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from "@angular/router";
import { VideoSubcategoryService } from '../video-subcategory.service';
import { VideoCategoryService } from '../../video-category/video-category.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  form: FormGroup;
  cat_id;
  categories: any;
  category;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
    public VideoSubcategoryService: VideoSubcategoryService,
    public VideoCategoryService: VideoCategoryService
  ) {

    this.VideoCategoryService.list().subscribe(
      data => {
          if(data.status == true){
            this.categories = data.data;
          }
      },
      error => {
          console.log(error); 
      }
    );

    this.form = formBuilder.group({
      title: ['', [Validators.required]],
      status: [''],
      meta_keywords: [''],
      meta_description: ['']
    });

    this.activatedRoute.params.subscribe(paramsId => {
      this.cat_id = paramsId.id;
    });

    this.getCat();
  }

  ngOnInit() {
  }

  getCat(){
    this.VideoSubcategoryService.get(this.cat_id).subscribe(
      data => {
        if(data.status == true){
          this.category = data.data[0].title;
          this.form.patchValue({
            category: data.data[0]._id,
            title: data.data[0].subcategories.title,
            status: data.data[0].subcategories.status,
            meta_keywords: data.data[0].subcategories.meta_keywords,
            meta_description: data.data[0].subcategories.meta_description
          })

        }else{
          Swal({
            title: "Oops",
            text: data.message,
            type: "error"
          }).then((function() {
            this.router.navigate(['/admin/video-subcategories']);
          }).bind(this));
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
      this.form.value.slug = this.form.value.title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
      this.VideoSubcategoryService.edit(this.form.value).subscribe(
        data => {
         
            if(data.status == true){
              Swal({
                title: "Success",
                text: data.message,
                type: "success"
              }).then((function() {
                this.router.navigate(['/admin/video-subcategories']);
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
