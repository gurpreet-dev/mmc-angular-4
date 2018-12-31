import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { SubscriptionPlansService } from '../../../services/subscription-plans.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  items: FormArray;
  plan_id;
  form: FormGroup;
  access = ['allowed', 'not allowed'];

  constructor(
    public SubscriptionPlansService: SubscriptionPlansService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      title: ['', [Validators.required]],
      cost: ['', [Validators.required, Validators.pattern(/^[0-9]+\.?[0-9]*$/)]],
      duration: ['', [Validators.required]],
      items: this.formBuilder.array([])
    });

    this.activatedRoute.params.subscribe(paramsId => {
      this.plan_id = paramsId.id;
    });

    this.getPlan();

  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      feature : '',
       access : ''
    });
  }

  ngOnInit() {
  }

  getPlan(){
    this.SubscriptionPlansService.get(this.plan_id).subscribe(
      data => {
        if(data.status == true){
          this.form.patchValue({
            title: data.data.title,
            cost: data.data.cost,
            duration: data.data.duration
          })

          this.patchFormArray(data.data);

        }else{
          Swal('Oops...', data.message, 'error')
        }
      },
      error => {
          console.log(error);
      }
    );
  }

  patchFormArray(data) {

    let ctrl = <FormArray>this.form.controls.items;
    if(data.features.length>0){
      for(var i = 0; i< data.features.length; i++){
        ctrl.push(this.formBuilder.group({
          feature: data.features[i].feature,
          access: data.features[i].access
        }))
      }
    }else{
      ctrl.push(this.formBuilder.group({
        feature: '',
        access: ''
      }))  
    }
   
  }

  addField(){
    this.items = this.form.get('items') as FormArray;
    this.items.push(this.createItem());
  }

  removeField(index){
    this.items = this.form.get('items') as FormArray;
    this.items.removeAt(index);

  }

  updatePlan(){
    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
    }else{
      this.form.value.id = this.plan_id;
      this.SubscriptionPlansService.edit(this.form.value).subscribe(
        data => {
            if(data.status == true){
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
