import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { Http } from '@angular/http';
import Swal from 'sweetalert2';
import { FaqService } from '../../../services/faq.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  form: FormGroup;
  faq_id;		

  constructor(
    private router: Router,
    public http: Http,
    public FaqService: FaqService,
    public formBuilder : FormBuilder,
    public activatedRoute: ActivatedRoute
  	) { 

  	this.form = this.formBuilder.group({
      question: ['', [Validators.required]],
      answer: ['', [Validators.required]]
    });

    this.activatedRoute.params.subscribe(paramsId => {
      this.faq_id = paramsId.id;
    });
    

  }

  ngOnInit() {

    this.getFaq();
  	
  }

  getFaq(){
    this.FaqService.get(this.faq_id).subscribe(
      data => {
        if(data.status == true){
          this.form.patchValue({
            question: data.data.question,
            answer: data.data.answer
          })

        }else{
          Swal({
            title: "oops",
            text: data.message,
            type: "error"
          }).then((function() {
            this.router.navigate(['/admin/faq']);
          }).bind(this));
        }
      },
      error => {
          console.log(error);
      }
    );
  }


  save(){

    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
    }else{ 

      this.form.value.id = this.faq_id;

    this.FaqService.edit(this.form.value).subscribe(
      data => {
        
          if(data.status == true){
              
            Swal({
              title: "Success",
              text: data.message,
              type: "success"
            }).then((function() {
              this.router.navigate(['/admin/faq']);
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
