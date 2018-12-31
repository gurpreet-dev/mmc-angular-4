import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuctionService } from '../../../../services/auction.service';
import Swal from 'sweetalert2';
import * as jwt_decode from "jwt-decode";
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { Router } from "@angular/router";

@Component({
  selector: 'app-auction-upload-video',
  templateUrl: './auction-upload-video.component.html',
  styleUrls: ['./auction-upload-video.component.css']
})
export class AuctionUploadVideoComponent implements OnInit {

  form: FormGroup;
  userinfo;
  percentage = 0;
  duration;
  thumbnail;
  video;

  value: Date;
  startMinDate = new Date();
  endMinDate = new Date();
  hideOnDateTimeSelect = true;
  dateFormat = 'dd-mm-yyyy';
  showSeconds = true;
  

  start_uploading = false;
  isDisabled = false;
  button = 'Upload';
  progressthumbnail_percentage = 0;
  progressvideo_percentage = 0;
  progressthumbnail_color = '#488aff';
  progressvideo_color = '#488aff';

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
      file: [null, [Validators.required]],
      thumbnail: [null, [Validators.required]]
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

  save(){
    if (this.form.invalid) {
      this.validateAllFormFields(this.form);
    }else{

      this.button = 'Please wait...';
      this.isDisabled = true;

      this.form.value.type = 'video';
      this.form.value.user_id = this.userinfo.id;
      this.form.value.size = this.video.size;

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
          res => this.add(this.form.value)
        )
      );
    }
  }

  uploadThumbnail(bucket){
    return new Promise((resolve, reject) => {

      // var thumbnail_folder = 'auction_thumbs';

      // const random1 = Math.floor(Math.random() * (9999999999 - 1000000000)) + 1000000000;

      // const params1 = {
      //   Bucket: 'www.mymodelconnection.com-images',
      //   Key: thumbnail_folder + '/' + random1 + '' + this.thumbnail.name,
      //   Body: this.thumbnail
      // };

      // bucket.upload(params1).on('httpUploadProgress', (evt : any) => {
      //   var per = Math.floor((evt.loaded * 100) / evt.total);
      //   this.progressthumbnail_percentage = per;

      // }).send((err, data) => {

      //   if (err) {
      //     console.log('There was an error uploading your file: ', err);
      //     return false;
      //   }else{
      //     this.thumbnail = data.Location;
      //     this.progressthumbnail_color = '#00cc99';
      //     resolve();
      //   }
      // });
      resolve()
    });
  }

  uploadVideo(bucket){
    return new Promise((resolve, reject) => {

      // var video_folder = 'auction_videos';

      // const random2 = Math.floor(Math.random() * (9999999999 - 1000000000)) + 1000000000;

      // const params2 = {
      //   Bucket: 'www.mymodelconnection.com-images',
      //   Key: video_folder + '/' + random2 + '' + this.form.value.video.name,
      //   Body: this.form.value.video
      // };

      // bucket.upload(params2).on('httpUploadProgress', (evt : any) => {
      //   //console.log('event', evt)
      //   var per = Math.floor((evt.loaded * 100) / evt.total);
      //   this.progressvideo_percentage = per;

      // }).send((err, data) => {

      //   if (err) {
      //     console.log('There was an error uploading your file: ', err);
      //     return false;
      //   }else{
      //     this.video = data.Location;
      //     this.progressvideo_color = '#00cc99';
      //     resolve();
      //   }

      // });

      resolve();
    });
  }

  add(data){

    // data.thumbnail = this.thumbnail;
    // data.file = this.video;

    data.thumbnail = 'https://s3.us-east-2.amazonaws.com/www.mymodelconnection.com-images/video_pics/2415599995promo_8.jpg';
    data.file = 'https://s3.us-east-2.amazonaws.com/www.mymodelconnection.com-images/videos/9552904837spizoo-teen-lola-foxx-is-punished-by-a-big-dick-big-booty-LOW.mp4';

    data.size = this.bytesToSize(data.size);
    data.duration = this.duration;

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
    this.button = 'Upload';   
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
