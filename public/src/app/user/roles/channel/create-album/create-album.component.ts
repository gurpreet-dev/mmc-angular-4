import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import Swal from 'sweetalert2';
import * as jwt_decode from "jwt-decode";
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { Router } from "@angular/router";

@Component({
  selector: 'app-create-album',
  templateUrl: './create-album.component.html',
  styleUrls: ['./create-album.component.css']
})
export class CreateAlbumComponent implements OnInit {

  form: FormGroup;
  userinfo;
  thumbnail;
  percentage = 0;
  isDisabled = false;
  button = 'Submit';
  selected_image;

  constructor(
    public UserService: UserService,
    private router: Router,
    public formBuilder: FormBuilder
  ) {

    this.userinfo = jwt_decode(localStorage.getItem('jwtToken'));

    this.form = formBuilder.group({
      title: ['', [Validators.required]],
      thumbnail: [null, [Validators.required]]
    });

  }

  ngOnInit() {
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

      // Swal({
      //   title: 'Please wait...'
      // });
      // Swal.showLoading();

      this.button = 'Please wait...';

      this.isDisabled = true;
      
      var file = this.thumbnail;

      var folder = 'album_pics';
      
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
  
      // bucket.upload(params,(err, data) => {
      //   if (err) {
      //     console.log('There was an error uploading your file: ', err);
      //     return false;
      //   }else{

      //     var info = {
      //       title: this.form.value.title,
      //       thumbnail : data.Location,
      //       user_id : this.userinfo.id
      //     }

      //     this.UserService.createAlbum(info).subscribe(
      //       data => {
      //         if(data.status == true){
      //           Swal({
      //             title: "Success",
      //             text: data.message,
      //             type: "success"
      //           }).then((function() {
      //             this.router.navigate(['/cprofile/albums']);
      //           }).bind(this));
      //         }else{
      //           Swal('oops', data.message, 'error');
      //         }
              
      //       }, error => {
      //         Swal('oops', 'Error in updating data', 'error');
      //       }
      //     )

      //     Swal.close();

      //   }
        
      // });

      bucket.upload(params).on('httpUploadProgress', (evt) => {
      
          var per = Math.floor((evt.loaded * 100) / evt.total);
          this.percentage = per;

        }).send((err, data) => {

          if (err) {
            console.log('There was an error uploading your file: ', err);
            return false;
          }else{
  
            var info = {
              title: this.form.value.title,
              thumbnail : data.Location,
              user_id : this.userinfo.id
            }
  
            this.UserService.createAlbum(info).subscribe(
              data => {
                if(data.status == true){
                  Swal({
                    title: "Success",
                    text: data.message,
                    type: "success"
                  }).then((function() {
                    this.router.navigate(['/cprofile/albums']);
                  }).bind(this));
                }else{
                  Swal('oops', data.message, 'error');
                }
                
              }, error => {
                Swal('oops', 'Error in updating data', 'error');
              }
            )
  
            //Swal.close();
            this.isDisabled = false;
            this.button = 'Submit';
  
          }                           

      });


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
