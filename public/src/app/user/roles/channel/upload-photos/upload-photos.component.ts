import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import Swal from 'sweetalert2';
import * as jwt_decode from "jwt-decode";
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

@Component({
  selector: 'app-upload-photos',
  templateUrl: './upload-photos.component.html',
  styleUrls: ['./upload-photos.component.css']
})
export class UploadPhotosComponent implements OnInit {

  
  userinfo: any;
  albums: any;
  form: FormGroup;
  images: any;
  percentage = 0;
  isDisabled = false;
  button = 'Submit';
  progressor = [];

  constructor(
    public UserService: UserService,
    public formBuilder: FormBuilder
  ) {
    this.userinfo = jwt_decode(localStorage.getItem('jwtToken'));

    this.form = formBuilder.group({
      album: ['', [Validators.required]],
      images: [null, [Validators.required]]
    });
  }

  ngOnInit() {

    var data = {
      user_id: this.userinfo.id
    }

    this.UserService.getAlbums(data).subscribe(
      data => {

        if(data.status == true){
         this.albums = data.data.albums;
        }
        
      }, error => {
        Swal('oops', 'Error in updating data', 'error');
      }
    )

  }

  setImages(fileInput : any){

    if(fileInput.target.files.length <= 10){
      this.images = fileInput.target.files;

      for(var i = 0; i < this.images.length; i++){
        this.progressor.push({ 'image' : this.images[i].name, 'percentage' : 0 , 'color' : '#488aff'});
      }
    }else{
      this.form.patchValue( {'images':null} )
      Swal('Info', 'You can upload only 10 Images at a time', 'info');
    }

  }

  

  async save(){
    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
    }else{

      this.button = 'Please wait...';

      this.isDisabled = true;
      
      var files = this.images;

      var folder = 'simple_pics';
      
      const bucket = new S3(
        {
          accessKeyId: 'AMAZON API KEY',
          secretAccessKey: 'AMAZON SECRET KEY',
          region: 'us-east-2'
        }
      );

      var i=0;
      for(let file of files){

        const random = Math.floor(Math.random() * (9999999999 - 1000000000)) + 1000000000;

        const params = {
          Bucket: 'www.mymodelconnection.com-images',
          Key: folder + '/' + random + '' + file.name,
          Body: file
        };
  
        this.images[i].percentage = 0;
        
        await new Promise(resolve => {
          bucket.upload(params).on('httpUploadProgress', (evt : any) => {

              var per = Math.floor((evt.loaded * 100) / evt.total);
    
              this.percentage = per;

              this.progressor[i].percentage = per;
              // if(per == 100){
              //   this.progressor[i].color = '#00cc99';
              // }


          }).send((err, data) => {
    
            if (err) {
              console.log('There was an error uploading your file: ', err);
              return false;
            }else{

              var info = {
                user_id: this.userinfo.id,
                album_id: this.form.value.album,
                image : data.Location
              }

              this.UserService.uploadPhotos(info).subscribe(
                data => {
          
                  if(data.status == true){
                    this.progressor[i].color = '#00cc99';
                  }else{
                    this.progressor[i].color = '#cc0000';
                  }
                  resolve();
                  
                }, error => {
                  console.log(error);
                  resolve();
                }
              )
    
            }    
            
    
          });
        });
        i++;
      }

      this.isDisabled = false;
      this.button = 'Submit';
      Swal('Success', 'Images Uploaded successfully', 'success');
      this.progressor = [];
      this.form.reset();

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
