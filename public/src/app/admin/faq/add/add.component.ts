import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import Swal from 'sweetalert2';
import { FaqService } from '../../../services/faq.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  form: FormGroup;		

  constructor(
    private router: Router,
    public http: Http,
    public FaqService: FaqService,
    public formBuilder : FormBuilder
  	) { 

  	this.form = this.formBuilder.group({
      question: ['', [Validators.required]],
      answer: ['', [Validators.required]]
    });
    

  }

  ngOnInit() {
  	
  }


  save(){

    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
    }else{ 

    this.FaqService.add(this.form.value).subscribe(
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
