import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { authService } from '../../../../auth/auth.service';
import { opentokService } from '../../../../services/opentok.service'; 
import { UserService } from '../../../../services/user.service'; 
import * as jwt_decode from "jwt-decode";
//import * as OT from '@opentok/client';

const publish = () => {

};

@Component({
  selector: 'live-broadcast',
  templateUrl: './live-broadcast.component.html',
  styleUrls: ['./live-broadcast.component.css'],
  providers: [authService, opentokService, UserService]
})
export class LiveBroadcastComponent {

  @ViewChild('publisherDiv') publisherDiv: ElementRef;
  //@ViewChild('history') history: ElementRef;

  viewers = 0;

  otDetails = {
    apikey: '46166842',
    sessionId: '',
    userName: '',
    userType: '',
    role: '',
    token: ''
  };

  currentUser;

  offline = true;

  userinfo;
  oTsession;
  public stop_button = false;
  public start_button = true;

  start_button_label = 'Start Broadcasting';

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
    this.getCurrentuser();
  }

  getCurrentuser(){

      this._userService.getUser({id: this.userinfo.id}).subscribe(
        data => {
          if(data.status == true){
            this.currentUser = data.data;  
          }
        }
      )

  }

  start_video(){
    this.start_button_label = 'Please wait...';
    this.opentokService.createSession().subscribe(
      data => {
          if(data.status == true){
            this.updateUserSession(data.session_id);
          }else{
            this.error(data.message);
            this.start_button_label = 'Start Broadcasting';
          }
      },
      error => {
          console.log(error);
          this.start_button_label = 'Start Broadcasting';
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
        console.log(response)
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
  
    var publisher = OT.initPublisher(this.publisherDiv.nativeElement, {insertMode: 'append',
    width: '100%', height: '503px'});

    this.oTsession.connect(otDetails.token, (err) => {
      if (err) {
          alert(err);
      } else {
        console.log('fegadge');
        this.offline = false;
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
        this.offline = false;
        console.log('Streaming starts....');
        this.start_button = false;
        this.stop_button = true;

        publisher.on("streamPropertyChanged", function (event) {
          console.log('Event', event);
        });

        var msgHistory = document.querySelector('#history');
        session.on('signal:msg', (event) => {
            //console.log(session)
            //console.log(event)
            var msg = document.createElement('div');
            msg.className = "chat-wrapper user";
            msg.setAttribute('_ngcontent-c5', '');

            msg.innerHTML = event.data;
            msgHistory.appendChild(msg);
            msg.scrollIntoView();
        });

        var form = document.getElementById("chat-form");
        var msgTxt = document.querySelector('#msgTxt') as HTMLInputElement;

        // Send a signal once the user enters data in the form
        if(form){
        form.addEventListener('submit', (event) => {
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

    session.on({

      // This event is triggered whenever there is a new connection.
      connectionCreated:  (evt) => {

        this.viewers = parseInt(document.getElementById('viewers').innerHTML);
        this.viewers = this.viewers + 1;
        session.signal({
            type: 'viewers',
            data: this.viewers
        }, function(error) {
            if (error) {
                console.log('Error sending signal:', error.name, error.message);
            }
        });
      },
  
      // This event is triggered whenever a connection quits
      connectionDestroyed: function (evt) {

        this.viewers = parseInt(document.getElementById('viewers').innerHTML);
        this.viewers = this.viewers - 1;
        session.signal({
            type: 'viewers',
            data: this.viewers--,
        }, function(error) {
            if (error) {
                console.log('Error sending signal:', error.name, error.message);
            }
        });
      }
  });

  session.on('signal:viewers', (event) => {
      var msg = document.getElementById('viewers');
      msg.innerHTML = event.data;
  });


  }

  disconnect_video(){
    if(confirm("Are you sure to stop the session?")) {
      this.oTsession.disconnect();
      this.oTsession.forceUnpublish();
      this.goOnline('no');
      this.start_button = true;
      this.stop_button = false;
      this.offline = true;
      this.start_button_label = 'Start Broadcasting';

      var msg = document.getElementById('viewers');
      msg.innerHTML = '0';

    }

  }

  goOnline(online){
    this._userService.goOnline({id: this.userinfo.id, online: online}).subscribe();
  }

}
