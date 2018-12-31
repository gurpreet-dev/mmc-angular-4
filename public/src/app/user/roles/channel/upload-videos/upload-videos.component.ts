import { Component, OnInit } from '@angular/core';
import { VideoCategoryService } from '../../../../admin/video-category/video-category.service';
import { VideoSubcategoryService } from '../../../../admin/video-subcategory/video-subcategory.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';
import * as jwt_decode from "jwt-decode";
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { Router } from "@angular/router";

@Component({
  selector: 'app-upload-videos',
  templateUrl: './upload-videos.component.html',
  styleUrls: ['./upload-videos.component.css']
})
export class UploadVideosComponent implements OnInit {

  categories: any;
  form: FormGroup;
  duration;
  thumbnail;
  video;
  start_uploading = false;
  isDisabled = false;
  button = 'Upload';
  progressthumbnail_percentage = 0;
  progressvideo_percentage = 0;
  progressthumbnail_color = '#488aff';
  progressvideo_color = '#488aff';

  constructor(
    public VideoCategoryService: VideoCategoryService,
    public VideoSubcategoryService: VideoSubcategoryService,
    public router: Router,
    public formBuilder: FormBuilder
  ) {
    this.form = formBuilder.group({
      categories: ['', [Validators.required]],
      title: ['', [Validators.required]],
      thumbnail: [null, [Validators.required]],
      video: [null, [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    
    this.VideoCategoryService.list().subscribe(
      data => {
        if(data.status == true){
          this.categories = data.data;
        }
      }, error => {
        console.log(error);
      }
    )
  }

  setThumbnail(fileInput : any){

    if(fileInput.target.files[0].size <= 1000000){
      this.thumbnail = fileInput.target.files[0];
    }else{
      Swal('info', "Image size should be less than 1MB", 'info');
      this.form.patchValue( {'thumbnail':null} )
    }

  }

  setVideo(fileInput : any){
    this.video = fileInput.target.files[0]

    var reader = new FileReader();
    reader.onload = (e) => {
        var media = new Audio(reader.result);
        media.onloadedmetadata = () =>  {

          var time = media.duration;

          var hours = Math.floor(time / 3600);
          time -= hours * 3600;

          var minutes = Math.floor(time / 60);
          time -= minutes * 60;

          var seconds = Math.floor(time % 60);

          if(hours > 0){
            this.duration = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
          }else{
            this.duration = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
          }
        };    
    };

    reader.readAsDataURL( this.video);

  }

  async save(){
    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
      console.log(this.form.invalid);
      console.log('if');
    }else{

      this.form.value.thumbnail = this.thumbnail;
      this.form.value.video = this.video;

      this.form.value.size = this.video.size;

      this.isDisabled = true;
      this.button = 'Please wait...';
      this.start_uploading = true;
      
      const bucket = new S3(
        {
          accessKeyId: 'AMAZON API KEY',
          secretAccessKey: 'AMAZON SECRET KEY',
          region: 'us-east-2',
          httpOptions: {timeout: 0}
        }
      );

      this.uploadThumbnail(bucket).then(
        res => this.uploadVideo(bucket).then(
          res => this.update(this.form.value)
        )
      );

    }
  }

  uploadThumbnail(bucket){

    return new Promise((resolve, reject) => {

      var thumbnail_folder = 'video_pics';

      const random1 = Math.floor(Math.random() * (9999999999 - 1000000000)) + 1000000000;

      const params1 = {
        Bucket: 'www.mymodelconnection.com-images',
        Key: thumbnail_folder + '/' + random1 + '' + this.thumbnail.name,
        Body: this.thumbnail
      };

      bucket.upload(params1).on('httpUploadProgress', (evt : any) => {
        var per = Math.floor((evt.loaded * 100) / evt.total);
        this.progressthumbnail_percentage = per;

      }).send((err, data) => {

        if (err) {
          console.log('There was an error uploading your file: ', err);
          return false;
        }else{
          this.thumbnail = data.Location;
          this.progressthumbnail_color = '#00cc99';
          resolve();
        }
      });
    });
  }

  uploadVideo(bucket){
    return new Promise((resolve, reject) => {

      var video_folder = 'videos';

      const random2 = Math.floor(Math.random() * (9999999999 - 1000000000)) + 1000000000;

      const params2 = {
        Bucket: 'www.mymodelconnection.com-images',
        Key: video_folder + '/' + random2 + '' + this.form.value.video.name,
        Body: this.form.value.video
      };

      bucket.upload(params2).on('httpUploadProgress', (evt : any) => {
        //console.log('event', evt)
        var per = Math.floor((evt.loaded * 100) / evt.total);
        this.progressvideo_percentage = per;

      }).send((err, data) => {

        if (err) {
          console.log('There was an error uploading your file: ', err);
          return false;
        }else{
          this.video = data.Location;
          this.progressvideo_color = '#00cc99';
          resolve();
        }

      });
    });
  }

  update(data){
    data.thumbnail = this.thumbnail;
    data.video = this.video;

    data.size = this.bytesToSize(data.size);
    data.duration = this.duration;
    
    var userinfo = jwt_decode(localStorage.getItem('jwtToken'));
    data.user_id = userinfo.id;

    this.VideoSubcategoryService.addVideo(data).subscribe(
      data => {

        if(data.status == true){
          this.form.reset();

          Swal({
            title: "Success",
            text: data.message,
            type: "success"
          }).then((function() {
            this.router.navigate(['/cprofile/videos']);
          }).bind(this));

          
        }else{
          Swal('oops', data.message, 'error');
        }

        this.isDisabled = false;
        this.button = 'Upload';
        this.start_uploading = false;
        
      }, error => {
        console.log(error);
      }

      
    )

  }

  bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    if (bytes == 0) return '0 Byte';

    var i = Math.floor(Math.log(bytes) / Math.log(1024));
    var number = bytes / Math.pow(1024, i);
    return number.toFixed(2) + ' ' + sizes[i];

 };

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
