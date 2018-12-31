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
var authService = (function () {
    function authService(router) {
        this.router = router;
    }
    authService.prototype.isLoggedin = function () {
        if (localStorage.getItem('jwtToken') === null) {
            return false;
        }
        else {
            return true;
        }
    };
    authService.prototype.loginCheck = function (loggedin) {
        if (loggedin == 'yes') {
            if (localStorage.getItem('jwtToken') === null) {
                this.router.navigate(['/']);
                return false;
            }
            else {
                return true;
            }
        }
        else {
            if (localStorage.getItem('jwtToken') === null) {
                return true;
            }
            else {
                this.router.navigate(['/']);
                return false;
            }
        }
    };
    authService.prototype.canActivate = function (route) {
        var loggedin_required = route.data["loggedin"];
        return this.loginCheck(loggedin_required);
    };
    authService.prototype.logout = function () {
        localStorage.removeItem('jwtToken');
        window.location.href = '/auth/login';
    };
    authService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [router_1.Router])
    ], authService);
    return authService;
}());
exports.authService = authService;
//# sourceMappingURL=auth.service.js.map