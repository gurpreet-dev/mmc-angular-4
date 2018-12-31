import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { authService } from '../../auth/auth.service';
import { opentokService } from '../../services/opentok.service'; 
import { UserService } from '../../services/user.service'; 
import * as jwt_decode from "jwt-decode";
//import * as OT from '@opentok/client';

const publish = () => {

};

@Component({
  selector: 'broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.scss'],
  providers: [authService, opentokService, UserService]
})
export class BroadcastComponent {

  @ViewChild('publisherDiv') publisherDiv: ElementRef;
  //@ViewChild('history') history: ElementRef;


  otDetails = {
    apikey: '46166842',
    sessionId: '',
    userName: '',
    userType: '',
    role: '',
    token: ''
  };

  userinfo;
  oTsession;
  public stop_button = false;
  public start_button = true;

  constructor(
    private router: Router, 
    private http: Http,
    public _userService: UserService,
    public opentokService: opentokService,
  ) {
    
  }

  ngOnInit(){   
    this.userinfo = jwt_decode(localStorage.getItem('jwtToken'));
    this.goOnline('no');
  }

  start_video(){
    this.opentokService.createSession().subscribe(
      data => {
          if(data.status == true){
            this.updateUserSession(data.session_id);
          }else{
            this.error(data.message+'wfvgdeswgd');
          }
      },
      error => {
          console.log(error);
      }
    );
  }

  updateUserSession(session_id){

    this._userService.updateOpentokSession({'id': this.userinfo.id, 'session_id': session_id}).subscribe(
        data => {
            if(data.status == true){
              this.createToken(session_id, data.data.name, 'organizer', 'publisher');
            }else{
              this.error(data.message);
            }
        },
        error => {
            console.log(error);
        }
    );

  }

  createToken(sessionId, userName, userType = 'organizer', role = 'publisher'){

    var data = {
      apikey: '46166842',
      sessionId: sessionId,
      userName: userName,
      userType: userType,
      role: role,
      token: ''
    }

    this.opentokService.generateToken(data).subscribe(
      response => {
          if(response.status == true){
            data['token'] = response.token;
            this.otDetails = data;
            this.initializeSession(this.otDetails);

          }else{
            this.error(response.message);
          }
      },
      error => {
          console.log(error);
      }
  );
  }

  error(message){
    alert(message);
  }

  /***********************/


  initializeSession(otDetails) {

    this.oTsession = this.opentokService.getOT().initSession(otDetails.apikey, otDetails.sessionId);
  
    var publisher = OT.initPublisher(this.publisherDiv.nativeElement, {insertMode: 'append'});

    this.oTsession.connect(otDetails.token, (err) => {
      if (err) {
          alert(err);
      } else {
          this.publish(publisher, this.oTsession);
      }
    });  


  }

  publish(publisher, session) {
    session.publish(publisher, (err) => {
      if (err) {
        alert(err.message);
      } else {
        this.goOnline('yes');
        console.log('Streaming starts....');
        this.start_button = false;
        this.stop_button = true;

        var msgHistory = document.querySelector('#history');
        session.on('signal:msg', function(event) {
            //console.log(session)
            //console.log(event)
            var msg = document.createElement('p');
            msg.textContent = event.data;
            msgHistory.appendChild(msg);
            msg.scrollIntoView();
        });

        var form = document.querySelector('form');
        var msgTxt = document.querySelector('#msgTxt') as HTMLInputElement;

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
  }

  disconnect_video(){
    if(confirm("Are you sure to stop the session?")) {
      this.oTsession.disconnect();
      this.oTsession.forceUnpublish();
      this.goOnline('no');
      this.start_button = true;
      this.stop_button = false;
    }

  }

  goOnline(online){
    this._userService.goOnline({id: this.userinfo.id, online: online}).subscribe();
  }

}
