import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import * as jwt_decode from "jwt-decode";
import Swal from 'sweetalert2';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subscriber-layout',
  templateUrl: './subscriber-layout.component.html',
  styleUrls: ['./subscriber-layout.component.css']
})

export class SubscriberLayoutComponent implements OnInit {
 
  currentUser;
  public showBanner:boolean = true;
  public showProfile:boolean = true;

  constructor(
    public UserService: UserService,
    public router: Router
  ) {
  }

  ngOnInit() {

    this.currentUser = jwt_decode(localStorage.getItem('jwtToken'));
    this.currentUser.profilepic = '../../assets/images/noimage.png';
    this.UserService.getUser({id: this.currentUser.id}).subscribe(
      data => {
        if(data.status == true){
          this.currentUser = data.data

          if(this.currentUser.profilepic == undefined){
            this.currentUser.profilepic = '../../assets/images/noimage.png';
          }

        }else{
          Swal('Oops', 'Please login again to continue!', 'error');
        }
      },error => {
        Swal('Oops', 'Please login again to continue!', 'error');
      }
    )

    setTimeout(() => {
      this.showBanner = false;
      this.showProfile = false;
    }, 4000);

  }

  changeProfile(fileInput: any){

    this.showProfile = true;

    var file = fileInput.target.files[0];

    var folder = 'profile_pics';
    
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
 
    bucket.upload(params,(err, data1) => {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }else{

        var info = {
          profileurl : data1.Location,
          user_id : this.currentUser._id
        }

        this.UserService.updateProfilePic(info).subscribe(
          data => {
            this.refresh();
          }, error => {
            Swal('oops', 'Error in updating profile pic!', 'error');
          }
        )

        //this.showProfile = false;

      }
      
    });

  }

  changeBanner(fileInput: any){

    this.showBanner = true;

    var file = fileInput.target.files[0];

    var folder = 'banner_pics';
    
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
      Key: folder + '/' + random + '' + file.name,
      Body: file
    };
 
    bucket.upload(params,(err, data1) => {
      if (err) {
        console.log('There was an error uploading your file: ', err);
        return false;
      }else{

        var info = {
          bannerurl : data1.Location,
          user_id : this.currentUser._id
        }

        this.UserService.updateBannerPic(info).subscribe(
          data => {
            this.refresh();
          }, error => {
            Swal('oops', 'Error in updating profile pic!', 'error');
          }
        )

        //this.showBanner = false;

      }
      
    });

  }

  refresh(){
    this.UserService.getUser({id: this.currentUser._id}).subscribe(
      data => {
        if(data.status == true){
          this.currentUser = data.data
        }else{
          Swal('Oops', 'Please login again to continue!', 'error');
        }
      },error => {
        Swal('Oops', 'Please login again to continue!', 'error');
      }
    )

    setTimeout(()=>{    
      this.showProfile = false;
      this.showBanner = false;
    }, 5000);

  }

}
