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
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var auth_service_1 = require("../auth.service");
var user_service_1 = require("../../services/user.service");
var LoginComponent = (function () {
    function LoginComponent(router, http, formBuilder, UserService, _authService) {
        this.router = router;
        this.http = http;
        this.UserService = UserService;
        this._authService = _authService;
        this.form = formBuilder.group({
            email: [''],
            password: ['']
        });
    }
    LoginComponent.prototype.ngOnInit = function () { };
    LoginComponent.prototype.login = function () {
        this.UserService.login(this.form.value).subscribe(function (data) {
            if (data.status == true) {
                localStorage.setItem('jwtToken', data.token);
                window.location.href = '/';
            }
            else {
                alert(data.message);
            }
        }, function (error) {
            console.log(error);
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'login',
            templateUrl: './login.component.html',
            styleUrls: ['./login.component.scss'],
            providers: [auth_service_1.authService]
        }),
        __metadata("design:paramtypes", [router_1.Router,
            http_1.Http,
            forms_1.FormBuilder,
            user_service_1.UserService,
            auth_service_1.authService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map