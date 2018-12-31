import { Component, ViewChild, ElementRef , Input, NgZone} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { UserService } from '../../services/user.service';
import * as jwt_decode from "jwt-decode";
//import * as $ from 'jquery';
import * as OT from '@opentok/client';
import { opentokService } from '../../services/opentok.service';  
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
  providers: [UserService, opentokService]
})
export class ViewComponent {

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

  constructor(
    private router: Router, 
    private http: Http,
    private activatedRoute: ActivatedRoute,
    private _userService: UserService,
    private opentokService: opentokService,
    private zone:NgZone
  ) {
  }

  ngOnInit(){    
    this.activatedRoute.params.subscribe(paramsId => {
        this.user_id = paramsId.id;
        this.getUser(this.user_id);
    });

    // let timer = Observable.timer(5000,1000);
    // timer.subscribe(t=> {
    //   this.onDisconnect();
    // });
  }


  getUser(user_id){

    this._userService.getUser({'id': user_id}).subscribe(
        data => {
           if(data.status == true){
                this.username = data.data.name;
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
                    
                    // When stream is created
                    this.session.on('streamCreated', (event) => {
                      this.session.subscribe(event.stream, this.subscriberDiv.nativeElement, {
                        insertMode: 'append'
                      }, (err) => {
                          if (err) {
                            this.error(err);
                          }
                        }
                      );
                    });

                    // When stream is disconnected
                    this.session.on("streamDestroyed", (event) => {
                      this.goOnline('no');
                      this.error("Live stream is ended by " + this.username);
                    });

                    var msgHistory = document.querySelector('#history');
                    this.session.on('signal:msg', function(event) {
                        
                        var msg = document.createElement('p');
                        msg.textContent = event.data;
                        msgHistory.appendChild(msg);
                        msg.scrollIntoView();
                    });
                    
                    var form = document.querySelector('form');
                    var msgTxt = document.querySelector('#msgTxt') as HTMLInputElement;

                    var session = this.session;

                    // Send a signal once the user enters data in the form
                    form.addEventListener('submit', function(event) {
                        event.preventDefault();
                        
                        session.signal({
                            type: 'msg',
                            data: msgTxt.value,
                        }, function(error) {
                            if (error) {
                                console.log('Error sending signal:', error.name, error.message);
                            } else {
                                msgTxt.value = '';
                            }
                        });
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
        this.error(this.username + ' is not online')
    }
  }

  error(message){
    this.zone.run(() => {
      this.alertmsg = message;
    });

    //alert(message);
  }

  goOnline(online){
    this._userService.goOnline({id: this.user_id, online: online}).subscribe();
  }


}