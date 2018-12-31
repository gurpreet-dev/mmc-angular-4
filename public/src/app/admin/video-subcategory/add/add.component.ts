import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import Swal from 'sweetalert2'
import { VideoSubcategoryService } from '../video-subcategory.service';
import { VideoCategoryService } from '../../video-category/video-category.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  form: FormGroup;
  categories: any;		

  constructor(
  	private router: Router,
    public formBuilder : FormBuilder,
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

  	this.form = this.formBuilder.group({
      category: ['', [Validators.required]],
      title: ['', [Validators.required]],
      meta_keywords: [''],
      meta_description: ['']
    });
    

  }

  ngOnInit() {
  	
  }


  save(){

    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
    }else{ 

    this.form.value.slug = this.form.value.title.toLowerCase().replace(/[^\w ]+/g,'').replace(/ +/g,'-');
    //console.log(this.form.value);

    this.VideoSubcategoryService.add(this.form.value).subscribe(
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
