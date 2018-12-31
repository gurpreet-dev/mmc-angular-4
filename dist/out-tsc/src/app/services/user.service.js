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
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var common_service_1 = require("./common.service");
var UserService = (function () {
    function UserService(http, CommonService) {
        this.http = http;
        this.CommonService = CommonService;
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        this.options = new http_1.RequestOptions({ headers: this.headers });
    }
    UserService.prototype.login = function (data) {
        var body = JSON.stringify(data);
        return this.http.post(this.CommonService.base_url + '/users/login', body, this.options).map(function (res) { return res.json(); });
    };
    UserService.prototype.register = function (data) {
        var body = JSON.stringify(data);
        return this.http.post(this.CommonService.base_url + '/users', body, this.options).map(function (res) { return res.json(); });
    };
    UserService.prototype.updateOpentokSession = function (data) {
        var body = JSON.stringify(data);
        return this.http.post(this.CommonService.base_url + '/users/updateOpentokSession', body, this.options).map(function (res) { return res.json(); });
    };
    UserService.prototype.getUser = function (data) {
        return this.http.get(this.CommonService.base_url + '/users/get/' + data.id).map(function (res) { return res.json(); });
    };
    UserService.prototype.goOnline = function (data) {
        var body = JSON.stringify(data);
        return this.http.post(this.CommonService.base_url + '/users/goOnline', body, this.options).map(function (res) { return res.json(); });
    };
    UserService.prototype.getOnlineUsers = function () {
        return this.http.get(this.CommonService.base_url + '/users/getOnlineUsers').map(function (res) { return res.json(); });
    };
    UserService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, common_service_1.CommonService])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map