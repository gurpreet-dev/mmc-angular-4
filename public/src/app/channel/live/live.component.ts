import { Component, OnInit, ViewChild, ElementRef , Input, NgZone } from '@angular/core';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { UserService } from '../../services/user.service';
import { authService } from '../../auth/auth.service';
import * as OT from '@opentok/client';
import { opentokService } from '../../services/opentok.service';  
import {Observable} from 'rxjs/Rx';
import * as jwt_decode from "jwt-decode";

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit {

  channel_id;
  viewers = 0;

  @ViewChild('subscriberDiv') subscriberDiv: ElementRef;

  otDetails = {
    apikey: '46166842',
    sessionId: '',
    userName: '',
    userType: '',
    role: '',
    token: ''
  };

  user_id;
  username = '';
  session;
  alertmsg = '';
  offline = true;
  isLogged = false;
  currentUser: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _userService: UserService,
    private opentokService: opentokService,
    public authService: authService,
    private zone:NgZone
  ) {

    this.isLogged = this.authService.isLoggedin();

    this.activatedRoute.params.subscribe(paramsId => {
      this.channel_id = paramsId.id;
      this.getUser(this.channel_id);
    });

    if(this.isLogged){
      console.log('loggedin');
      this.getCurrentuser();
    }

    //this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  }

  ngOnInit() {
  }

  getUser(user_id){

    this._userService.getUser({'id': user_id}).subscribe(
        data => {
           if(data.status == true){
                this.username = data.data.firstname;
                this.streamVideo(data.data);
           }else{
                this.error('Live broadcasting is now unavailable');
           }
        },
        error => {
            console.log(error);
        }
    );

  }

  getCurrentuser(){
    if(localStorage.getItem('jwtToken')){
      this.currentUser = jwt_decode(localStorage.getItem('jwtToken'));
      this._userService.getUser({id: this.currentUser.id}).subscribe(
        data => {
          if(data.status == true){
            this.currentUser = data.data;  
          }
        }
      )
    }
  }

  streamVideo(user){
    if(user.online == 'yes'){

      var details = {
        apikey: '46166842',
        sessionId: user.opentok_session
      }

      // Create session
      this.session = this.opentokService.getOT().initSession(details.apikey, details.sessionId);

      var data = {
        apikey: '46166842',
        sessionId: details.sessionId,
        userName: user.name,
        userType: 'user',
        role: 'moderator'
      }

      // Generating a opentok token
      this.opentokService.generateToken(data).subscribe(
        response => {
            if(response.status == true){

              // Connect to session
              this.session.connect(response.token, (err) => {
                if (err) {
                  this.error(err);
                } else {
                  this.offline = false;
                    
                    // When stream is created
                    this.session.on('streamCreated', (event) => {
                      this.session.subscribe(event.stream, this.subscriberDiv.nativeElement, {
                        insertMode: 'append', width: '100%', height: '503px'
                      }, (err) => {
                          if (err) {
                            this.error(err);
                          }
                        }
                      );
                    });

                    // When stream is disconnected
                    this.session.on("streamDestroyed", (event) => {
                      //this.goOnline('no');
                      this.offline = true;
                      this.error("Live stream is ended by " + this.username);
                      var msg = document.getElementById('viewers');
                      msg.innerHTML = '0';
                    });

                    this.session.on("streamPropertyChanged", function (event) {
                    });

                    var msgHistory = document.querySelector('#history');
                    this.session.on('signal:msg', (event) => {
                        
                      var msg = document.createElement('div');
                      msg.className = "chat-wrapper user";
                      msg.setAttribute('_ngcontent-c5', '');

                      msg.innerHTML = event.data;
                      msgHistory.appendChild(msg);
                      msg.scrollIntoView();
                    });
                    
                    var form = document.getElementById("chat-form");
                    var msgTxt = document.querySelector('#msgTxt') as HTMLInputElement;

                    var session = this.session;

                    if(form){
                    // Send a signal once the user enters data in the form
                    form.addEventListener("submit", (event) => {
                        event.preventDefault();
                        if(msgTxt.value != ''){
                        var html = '<div _ngcontent-c5 class="avatar-icon">';
                        if(this.currentUser.profilepic == undefined){
                          html +='<img _ngcontent-c5 src="../../assets/images/noimage.png" alt="Avatar">';
                        }else{
                          html +='<img _ngcontent-c5 src="'+ this.currentUser.profilepic +'" alt="Avatar">';
                        }
  
                        html +='</div>';
                        html +='<div _ngcontent-c5 class="message-box">';
                        html +='<span _ngcontent-c5 class="name">'+ this.currentUser.firstname + ' ' + this.currentUser.lastname +'</span>';
                        html +='<span _ngcontent-c5 class="message">'+ msgTxt.value +'</span>';
                        html +='</div>';
                        
                        session.signal({
                            type: 'msg',
                            data: html,
                        }, function(error) {
                            if (error) {
                                console.log('Error sending signal:', error.name, error.message);
                            } else {
                                msgTxt.value = '';
                            }
                        });
                      }
                    });
                  }

                }
              });  

              this.session.on({

                // This event is triggered whenever there is a new connection.
                connectionCreated:  (evt) => {

                  this.session.on('signal:viewers', (event) => {
                      var msg = document.getElementById('viewers');
                      msg.innerHTML = event.data;
                  });

                },
            
                // This event is triggered whenever a connection quits
                connectionDestroyed: function (evt) {
                  
                  this.session.on('signal:viewers', (event) => {
                      var msg = document.getElementById('viewers');
                      msg.innerHTML = event.data;
                  });
                }
            });
          
  
            }else{
              this.error(response.message);
            }
        },
        error => {
          this.error(error);
        }
     );
    

    }else{
        //this.error(this.username + ' is not online')
    }
  }

  error(message){
    this.zone.run(() => {
      this.alertmsg = message;
    });

    alert(message);
  }

  // goOnline(online){
  //   this._userService.goOnline({id: this.channel_id, online: online}).subscribe();
  // }

}
