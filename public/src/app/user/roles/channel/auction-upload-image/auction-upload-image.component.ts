import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuctionService } from '../../../../services/auction.service';
import Swal from 'sweetalert2';
import * as jwt_decode from "jwt-decode";
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { Router } from "@angular/router";

@Component({
  selector: 'app-auction-upload-image',
  templateUrl: './auction-upload-image.component.html',
  styleUrls: ['./auction-upload-image.component.css']
})
export class AuctionUploadImageComponent implements OnInit {

  form: FormGroup;
  userinfo;
  thumbnail;
  percentage = 0;
  isDisabled = false;
  button = 'Submit';
  selected_image;

  value: Date;
  startMinDate = new Date();
  endMinDate = new Date();
  hideOnDateTimeSelect = true;
  dateFormat = 'dd-mm-yyyy';
  showSeconds = true;
  showProgress = false;

  constructor(
    public AuctionService: AuctionService,
    private router: Router,
    public formBuilder: FormBuilder
  ) {
    this.userinfo = jwt_decode(localStorage.getItem('jwtToken'));

    this.form = formBuilder.group({
      title: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.pattern(/^[0-9]+\.?[0-9]*$/)]],
      file: [null, [Validators.required]]
    });
  }

  ngOnInit() {
  }

  dateChange(data:any){

    this.endMinDate = new Date(new Date().setDate(data.getDate() + 1))

  }

  setThumbnail(fileInput : any){

    if(fileInput.target.files[0].size <= 1000000){
      this.thumbnail = fileInput.target.files[0];
      this.selected_image = this.thumbnail.name;
    }else{
      Swal('info', "Image size should be less than 1MB", 'info');
      this.form.patchValue( {'thumbnail':null} )
      this.selected_image = '';
    }

  }

  save(){
    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
    }else{

      this.button = 'Please wait...';
      this.isDisabled = true;

      this.form.value.type = 'image';
      this.form.value.user_id = this.userinfo.id;

      this.uploadThumbnail().then(
        res => this.add(this.form.value)
      );
    }
  }

  uploadThumbnail(){
    return new Promise((resolve, reject) => {
      var file = this.thumbnail
      var folder = 'auction_pics';
      
      const bucket = new S3(
        {
          accessKeyId: 'AMAZON API KEY',
          secretAccessKey: 'AMAZON SECRET KEY',
          region: 'us-east-2'
        }
      );

      const random = Math.floor(Math.random() * (9999999999 - 1000000000)) + 1000000000;
  
      const params = {
        Bucket: 'www.mymodelconnection.com-images',
        Key: folder + '/' + random+''+file.name,
        Body: file
      };

      this.showProgress = true;


      // bucket.upload(params).on('httpUploadProgress', (evt) => {
      
      //   var per = Math.floor((evt.loaded * 100) / evt.total);
      //   this.percentage = per;

      // }).send((err, data) => {

      //   if (err) {
      //     console.log('There was an error uploading your file: ', err);
      //     return false;
      //   }else{
      //     this.thumbnail = data.Location;
      //     resolve();
      //   }                      

      // });
      resolve();

    });
  }

  add(data){

    //data.file = this.thumbnail;
    data.file = 'https://s3.us-east-2.amazonaws.com/www.mymodelconnection.com-images/video_pics/2415599995promo_8.jpg';

    this.AuctionService.add(data).subscribe(
      data => {
        if(data.status == true){
          Swal({
            title: "Success",
            text: data.message,
            type: "success"
          }).then((function() {
            this.router.navigate(['/cprofile/auctions']);
          }).bind(this));
        }else{
          Swal('oops', data.message, 'error');
        }
      }
    )

    this.isDisabled = false;
    this.button = 'Submit';   
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
