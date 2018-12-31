import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../services/user.service';
import Swal from 'sweetalert2';
import * as jwt_decode from "jwt-decode";
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';


@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css']
})
export class AlbumsComponent implements OnInit {

  userinfo: any;
  albums: any;
  album_thumbnail;
  album_images = [];
  
  constructor(
    public UserService: UserService
  ) {
    this.userinfo = jwt_decode(localStorage.getItem('jwtToken'));
  }

  ngOnInit() {

    this.allAlbums();

  }

  allAlbums(){

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

  delete(id, thumbnail){
  
    Swal({
      title: 'Are you sure?',
      text: "You want to delete this album!",
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

        this.UserService.getAlbumPhotos(data).subscribe(
          data => {
            if(data.status == true){

              for(var i = 0; i < data.data.images.length; i++){
                this.album_images.push(decodeURIComponent(data.data.images[i].url));
              }

            }
          }, error => {
            console.log(error);
          }
        )

        const bucket = new S3(
          {
            accessKeyId: 'AMAZON API KEY',
            secretAccessKey: 'AMAZON SECRET KEY',
            region: 'us-east-2'
          }
        );

        this.UserService.deleteAlbum(data).subscribe(
          data => {
            if(data.status == true){

              /********* Deleting images from S3 bucket *******/

              Swal({
                title: 'Please wait...'
              })

              Swal.showLoading();
              
              this.allAlbums();

              for(let album_image of this.album_images){

                var image = album_image.split("https://s3.us-east-2.amazonaws.com/www.mymodelconnection.com-images/");
      
                const params = {
                  Bucket: 'www.mymodelconnection.com-images',
                  Key: image[1]
                };
                
                new Promise(resolve => {
                  bucket.deleteObject(params, (err, data1) => {
                    resolve();
                  });
                });
      
              }

              thumbnail = decodeURIComponent(thumbnail);

              thumbnail = thumbnail.split("https://s3.us-east-2.amazonaws.com/www.mymodelconnection.com-images/");
      
              const params2 = {
                Bucket: 'www.mymodelconnection.com-images',
                Key: thumbnail[1]
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
              Swal('oops', 'Unable to delete this album at this time. Try again later!', 'error');
            }
          }, error => {
            console.log(error);
          }
        )
      }
    })
  }

}
