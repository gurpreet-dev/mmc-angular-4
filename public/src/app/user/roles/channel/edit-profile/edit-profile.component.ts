import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import Swal from 'sweetalert2';
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  form: FormGroup;
  form1: FormGroup;

  userinfo;

  countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas"
	,"Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands"
	,"Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica"
	,"Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea"
	,"Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana"
	,"Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India"
	,"Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia"
	,"Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania"
	,"Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia"
	,"New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal"
	,"Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles"
	,"Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan"
	,"Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia"
	,"Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","United States Minor Outlying Islands","Uruguay"
	,"Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

  constructor(
    public UserService: UserService,
    public formBuilder: FormBuilder
  ) {

    this.userinfo = jwt_decode(localStorage.getItem('jwtToken'));

    this.form = formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: [{value: '', disabled: true}, [Validators.required, Validators.pattern("[^ @]*@[^ @]*")]],
      dob: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      country: ['', [Validators.required]],
      description: ['']
    });

    this.form1 = formBuilder.group({
      opass: ['', [Validators.required]],
      npass: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      cpass: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)], this.comparePassword.bind(this)]
    });

  }

  ngOnInit() {

    this.UserService.getUser({id:this.userinfo.id}).subscribe(
      data => {
        if(data.status == true){
          this.form.patchValue({
            firstname: data.data.firstname,
            lastname: data.data.lastname,
            phone: data.data.phone,
            email: data.data.email,
            dob: data.data.dob,
            gender: data.data.gender,
            country: data.data.country,
            description: data.data.description
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
      this.form.value.user_id = this.userinfo.id;
      this.UserService.update(this.form.value).subscribe(
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

  changePassword(){
    if (this.form1.invalid) {
      this.validateAllFormFields(this.form1);
    }else{
      this.form1.value.user_id = this.userinfo.id;

      this.UserService.changePassword(this.form1.value).subscribe(
        data => {
          if(data.status == true){
            Swal("Success", data.message, "success");
            this.form1.reset();
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

  comparePassword(control: FormControl){
    return new Promise(resolve => {
      if ((control.root.get('npass').value != control.value)){
          resolve({
            passwordMismatch: true
          })
          } else {
            resolve(null);
          }
      })
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
