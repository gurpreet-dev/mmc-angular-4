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
var NowComponent = (function () {
    function NowComponent(router, http, _userService) {
        this.router = router;
        this.http = http;
        this._userService = _userService;
    }
    NowComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._userService.getOnlineUsers().subscribe(function (data) {
            if (data.status == true) {
                _this.users = data.data;
            }
        }, function (error) {
            console.log(error);
        });
    };
    NowComponent = __decorate([
        core_1.Component({
            selector: 'app-now',
            templateUrl: './now.component.html',
            styleUrls: ['./now.component.scss'],
            providers: [user_service_1.UserService]
        }),
        __metadata("design:paramtypes", [router_1.Router,
            http_1.Http,
            user_service_1.UserService])
    ], NowComponent);
    return NowComponent;
}());
exports.NowComponent = NowComponent;
//# sourceMappingURL=now.component.js.map