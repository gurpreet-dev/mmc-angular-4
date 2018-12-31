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
var common_service_1 = require("../services/common.service");
var OT = require("@opentok/client");
var opentokService = (function () {
    function opentokService(http, CommonService) {
        this.http = http;
        this.CommonService = CommonService;
        this.url = this.CommonService.base_url;
    }
    opentokService.prototype.getOT = function () {
        return OT;
    };
    opentokService.prototype.createSession = function () {
        return this.http.get(this.url + '/opentok/createsession').map(function (res) { return res.json(); });
    };
    opentokService.prototype.generateToken = function (data) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        var body = JSON.stringify(data);
        return this.http.post(this.url + '/opentok/generatetoken', body, options).map(function (res) { return res.json(); });
    };
    opentokService.prototype.initSession = function (config) {
        this.session = this.getOT().initSession(config.apikey, config.sessionId);
        return Promise.resolve(this.session);
    };
    opentokService.prototype.connect = function (config) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.session.connect(config.token, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(_this.session);
                }
            });
        });
    };
    opentokService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http, common_service_1.CommonService])
    ], opentokService);
    return opentokService;
}());
exports.opentokService = opentokService;
//# sourceMappingURL=opentok.service.js.map