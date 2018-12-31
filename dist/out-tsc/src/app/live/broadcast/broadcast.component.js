"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var auth_service_1 = require("../../auth/auth.service");
var opentok_service_1 = require("../../services/opentok.service");
var user_service_1 = require("../../services/user.service");
var jwt_decode = require("jwt-decode");
//import * as OT from '@opentok/client';
var publish = function () {
};
var BroadcastComponent = (function () {
    function BroadcastComponent(router, http, _userService, opentokService) {
        this.router = router;
        this.http = http;
        this._userService = _userService;
        this.opentokService = opentokService;
        //@ViewChild('history') history: ElementRef;
        this.otDetails = {
            apikey: '46166842',
            sessionId: '',
            userName: '',
            userType: '',
            role: '',
            token: ''
        };
        this.stop_button = false;
        this.start_button = true;
    }
    BroadcastComponent.prototype.ngOnInit = function () {
        this.userinfo = jwt_decode(localStorage.getItem('jwtToken'));
        this.goOnline('no');
    };
    BroadcastComponent.prototype.start_video = function () {
        var _this = this;
        this.opentokService.createSession().subscribe(function (data) {
            if (data.status == true) {
                _this.updateUserSession(data.session_id);
            }
            else {
                _this.error(data.message + 'wfvgdeswgd');
            }
        }, function (error) {
            console.log(error);
        });
    };
    BroadcastComponent.prototype.updateUserSession = function (session_id) {
        var _this = this;
        this._userService.updateOpentokSession({ 'id': this.userinfo.id, 'session_id': session_id }).subscribe(function (data) {
            if (data.status == true) {
                _this.createToken(session_id, data.data.name, 'organizer', 'publisher');
            }
            else {
                _this.error(data.message);
            }
        }, function (error) {
            console.log(error);
        });
    };
    BroadcastComponent.prototype.createToken = function (sessionId, userName, userType, role) {
        var _this = this;
        if (userType === void 0) { userType = 'organizer'; }
        if (role === void 0) { role = 'publisher'; }
        var data = {
            apikey: '46166842',
            sessionId: sessionId,
            userName: userName,
            userType: userType,
            role: role,
            token: ''
        };
        this.opentokService.generateToken(data).subscribe(function (response) {
            if (response.status == true) {
                data['token'] = response.token;
                _this.otDetails = data;
                _this.initializeSession(_this.otDetails);
            }
            else {
                _this.error(response.message);
            }
        }, function (error) {
            console.log(error);
        });
    };
    BroadcastComponent.prototype.error = function (message) {
        alert(message);
    };
    /***********************/
    BroadcastComponent.prototype.initializeSession = function (otDetails) {
        var _this = this;
        this.oTsession = this.opentokService.getOT().initSession(otDetails.apikey, otDetails.sessionId);
        var publisher = OT.initPublisher(this.publisherDiv.nativeElement, { insertMode: 'append' });
        this.oTsession.connect(otDetails.token, function (err) {
            if (err) {
                alert(err);
            }
            else {
                _this.publish(publisher, _this.oTsession);
            }
        });
    };
    BroadcastComponent.prototype.publish = function (publisher, session) {
        var _this = this;
        session.publish(publisher, function (err) {
            if (err) {
                alert(err.message);
            }
            else {
                _this.goOnline('yes');
                console.log('Streaming starts....');
                _this.start_button = false;
                _this.stop_button = true;
                var msgHistory = document.querySelector('#history');
                session.on('signal:msg', function (event) {
                    //console.log(session)
                    //console.log(event)
                    var msg = document.createElement('p');
                    msg.textContent = event.data;
                    msgHistory.appendChild(msg);
                    msg.scrollIntoView();
                });
                var form = document.querySelector('form');
                var msgTxt = document.querySelector('#msgTxt');
                // Send a signal once the user enters data in the form
                form.addEventListener('submit', function (event) {
                    event.preventDefault();
                    session.signal({
                        type: 'msg',
                        data: msgTxt.value,
                    }, function (error) {
                        if (error) {
                            console.log('Error sending signal:', error.name, error.message);
                        }
                        else {
                            msgTxt.value = '';
                        }
                    });
                });
            }
        });
    };
    BroadcastComponent.prototype.disconnect_video = function () {
        if (confirm("Are you sure to stop the session?")) {
            this.oTsession.disconnect();
            this.oTsession.forceUnpublish();
            this.goOnline('no');
            this.start_button = true;
            this.stop_button = false;
        }
    };
    BroadcastComponent.prototype.goOnline = function (online) {
        this._userService.goOnline({ id: this.userinfo.id, online: online }).subscribe();
    };
    __decorate([
        core_1.ViewChild('publisherDiv'),
        __metadata("design:type", core_1.ElementRef)
    ], BroadcastComponent.prototype, "publisherDiv", void 0);
    BroadcastComponent = __decorate([
        core_1.Component({
            selector: 'broadcast',
            templateUrl: './broadcast.component.html',
            styleUrls: ['./broadcast.component.scss'],
            providers: [auth_service_1.authService, opentok_service_1.opentokService, user_service_1.UserService]
        }),
        __metadata("design:paramtypes", [router_1.Router,
            http_1.Http,
            user_service_1.UserService,
            opentok_service_1.opentokService])
    ], BroadcastComponent);
    return BroadcastComponent;
}());
exports.BroadcastComponent = BroadcastComponent;
//# sourceMappingURL=broadcast.component.js.map