import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { SubscriptionPlansService } from '../../../services/subscription-plans.service';
import Swal from 'sweetalert2';
import { Router } from "@angular/router";

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  items: FormArray;
  form: FormGroup;
  access = ['allowed', 'not allowed'];
  duration = ['week', 'month', 'year'];
  features = [{feature : '', access : ''}];

  constructor(
    public SubscriptionPlansService: SubscriptionPlansService,
    private router: Router,
    public formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      title: ['', [Validators.required]],
      cost: ['', [Validators.required, Validators.pattern(/^[0-9]+\.?[0-9]*$/)]],
      duration: ['', [Validators.required]],
      items: this.formBuilder.array([this.createItem()])
    });
  }

  ngOnInit() {
  }

  savePlan(){
    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
    }else{

      this.SubscriptionPlansService.add(this.form.value).subscribe(
        data => {
            if(data.status == true){

              this.form.reset();

              Swal({
                title: "Success",
                text: data.message,
                type: "success"
              }).then((function() {
                this.router.navigate(['/admin/plans']);
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

  addField(){
    this.items = this.form.get('items') as FormArray;
    this.items.push(this.createItem());
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      feature : '',
       access : ''
    });
  }

  removeField(index){
    this.items = this.form.get('items') as FormArray;
    this.items.removeAt(index);

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
