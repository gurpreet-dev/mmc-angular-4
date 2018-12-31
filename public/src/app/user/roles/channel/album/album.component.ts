import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import Swal from 'sweetalert2';
import * as jwt_decode from "jwt-decode";
import { Router, ActivatedRoute } from "@angular/router";
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';


@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit {

  photos: any;
  album_id

  constructor(
    public UserService: UserService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe(paramsId => {
      this.album_id = paramsId.id;
    });

    this.getPhotos();
    
  }

  getPhotos(){

    var data = {
      id: this.album_id
    }

    this.UserService.getAlbumPhotos(data).subscribe(
      data => {

        if(data.status == true){
         this.photos = data.data.images;
        }
        
      }, error => {
        console.log(error);
      }
    )
  }

  delete(id, image){
    

    Swal({
      title: 'Are you sure?',
      text: "You want to delete this image!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {

        var data = {
          id: id
        }

        const bucket = new S3(
          {
            accessKeyId: 'AMAZON API KEY',
            secretAccessKey: 'AMAZON SECRET KEY',
            region: 'us-east-2'
          }
        );

        this.UserService.deleteImage(data).subscribe(
          data => {
            if(data.status == true){

              /********* Deleting images from S3 bucket *******/

              Swal({
                title: 'Please wait...'
              })

              Swal.showLoading();
              
              this.getPhotos();

              image = decodeURIComponent(image);

              image = image.split("https://s3.us-east-2.amazonaws.com/www.mymodelconnection.com-images/");
      
              const params2 = {
                Bucket: 'www.mymodelconnection.com-images',
                Key: image[1]
              };
              
              new Promise(resolve => {
                bucket.deleteObject(params2, (err, data1) => {
                  resolve();
                });
              });

              Swal.close();

              /********* Deleting images from S3 bucket (END) *******/

              Swal('Deleted!', data.message, 'success')

            }else{
              Swal('oops', 'Unable to delete this image at this time. Try again later!', 'error');
            }
          }, error => {
            console.log(error);
          }
        )
      }
    })

  }

}
