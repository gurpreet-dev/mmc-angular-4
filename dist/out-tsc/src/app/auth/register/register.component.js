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
var auth_service_1 = require("../auth.service");
var user_service_1 = require("../../services/user.service");
var RegisterComponent = (function () {
    function RegisterComponent(router, http, _authService, UserService, formBuilder) {
        this.router = router;
        this.http = http;
        this._authService = _authService;
        this.UserService = UserService;
        this.roles = ['user', 'channel'];
        this.form = formBuilder.group({
            name: [''],
            email: [''],
            password: [''],
            role: ['']
        });
    }
    RegisterComponent.prototype.ngOnInit = function () {
    };
    RegisterComponent.prototype.save = function () {
        this.createUser(this.form.value);
    };
    RegisterComponent.prototype.createUser = function (data) {
        this.UserService.register(data).subscribe(function (data) {
            if (data.status == true) {
                alert(data.message);
            }
            else {
                alert(data.message);
            }
        }, function (error) {
            console.log(error);
        });
    };
    RegisterComponent.prototype.open = function () {
    };
    RegisterComponent = __decorate([
        core_1.Component({
            selector: 'register',
            templateUrl: './register.component.html',
            styleUrls: ['./register.component.scss'],
            providers: [auth_service_1.authService, user_service_1.UserService]
        }),
        __metadata("design:paramtypes", [router_1.Router,
            http_1.Http,
            auth_service_1.authService,
            user_service_1.UserService,
            forms_1.FormBuilder])
    ], RegisterComponent);
    return RegisterComponent;
}());
exports.RegisterComponent = RegisterComponent;
//# sourceMappingURL=register.component.js.map