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
var user_service_1 = require("../../services/user.service");
var opentok_service_1 = require("../../services/opentok.service");
var ViewComponent = (function () {
    function ViewComponent(router, http, activatedRoute, _userService, opentokService, zone) {
        this.router = router;
        this.http = http;
        this.activatedRoute = activatedRoute;
        this._userService = _userService;
        this.opentokService = opentokService;
        this.zone = zone;
        this.otDetails = {
            apikey: '46166842',
            sessionId: '',
            userName: '',
            userType: '',
            role: '',
            token: ''
        };
        this.username = '';
        this.alertmsg = '';
    }
    ViewComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.params.subscribe(function (paramsId) {
            _this.user_id = paramsId.id;
            _this.getUser(_this.user_id);
        });
        // let timer = Observable.timer(5000,1000);
        // timer.subscribe(t=> {
        //   this.onDisconnect();
        // });
    };
    ViewComponent.prototype.getUser = function (user_id) {
        var _this = this;
        this._userService.getUser({ 'id': user_id }).subscribe(function (data) {
            if (data.status == true) {
                _this.username = data.data.name;
                _this.streamVideo(data.data);
            }
            else {
                _this.error('Live broadcasting is now unavailable');
            }
        }, function (error) {
            console.log(error);
        });
    };
    ViewComponent.prototype.streamVideo = function (user) {
        var _this = this;
        if (user.online == 'yes') {
            var details = {
                apikey: '46166842',
                sessionId: user.opentok_session
            };
            // Create session
            this.session = this.opentokService.getOT().initSession(details.apikey, details.sessionId);
            var data = {
                apikey: '46166842',
                sessionId: details.sessionId,
                userName: user.name,
                userType: 'user',
                role: 'moderator'
            };
            // Generating a opentok token
            this.opentokService.generateToken(data).subscribe(function (response) {
                if (response.status == true) {
                    // Connect to session
                    _this.session.connect(response.token, function (err) {
                        if (err) {
                            _this.error(err);
                        }
                        else {
                            // When stream is created
                            _this.session.on('streamCreated', function (event) {
                                _this.session.subscribe(event.stream, _this.subscriberDiv.nativeElement, {
                                    insertMode: 'append'
                                }, function (err) {
                                    if (err) {
                                        _this.error(err);
                                    }
                                });
                            });
                            // When stream is disconnected
                            _this.session.on("streamDestroyed", function (event) {
                                _this.goOnline('no');
                                _this.error("Live stream is ended by " + _this.username);
                            });
                            var msgHistory = document.querySelector('#history');
                            _this.session.on('signal:msg', function (event) {
                                var msg = document.createElement('p');
                                msg.textContent = event.data;
                                msgHistory.appendChild(msg);
                                msg.scrollIntoView();
                            });
                            var form = document.querySelector('form');
                            var msgTxt = document.querySelector('#msgTxt');
                            var session = _this.session;
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
                }
                else {
                    _this.error(response.message);
                }
            }, function (error) {
                _this.error(error);
            });
        }
        else {
            this.error(this.username + ' is not online');
        }
    };
    ViewComponent.prototype.error = function (message) {
        var _this = this;
        this.zone.run(function () {
            _this.alertmsg = message;
        });
        //alert(message);
    };
    ViewComponent.prototype.goOnline = function (online) {
        this._userService.goOnline({ id: this.user_id, online: online }).subscribe();
    };
    __decorate([
        core_1.ViewChild('subscriberDiv'),
        __metadata("design:type", core_1.ElementRef)
    ], ViewComponent.prototype, "subscriberDiv", void 0);
    ViewComponent = __decorate([
        core_1.Component({
            selector: 'view',
            templateUrl: './view.component.html',
            styleUrls: ['./view.component.scss'],
            providers: [user_service_1.UserService, opentok_service_1.opentokService]
        }),
        __metadata("design:paramtypes", [router_1.Router,
            http_1.Http,
            router_1.ActivatedRoute,
            user_service_1.UserService,
            opentok_service_1.opentokService,
            core_1.NgZone])
    ], ViewComponent);
    return ViewComponent;
}());
exports.ViewComponent = ViewComponent;
//# sourceMappingURL=view.component.js.map