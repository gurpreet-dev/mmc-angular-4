"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var http_1 = require("@angular/http");
var material_1 = require("@angular/material");
var auth_routes_1 = require("./auth.routes");
var register_component_1 = require("./register/register.component");
var login_component_1 = require("./login/login.component");
var AuthModule = (function () {
    function AuthModule() {
    }
    AuthModule.routes = auth_routes_1.routes;
    AuthModule = __decorate([
        core_1.NgModule({
            declarations: [
                /**
                 * Components / Directives/ Pipes
                 */
                register_component_1.RegisterComponent,
                login_component_1.LoginComponent
            ],
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                router_1.RouterModule.forChild(auth_routes_1.routes),
                forms_1.ReactiveFormsModule,
                router_1.RouterModule,
                http_1.HttpModule,
                material_1.MatCardModule,
                material_1.MatListModule,
                material_1.MatInputModule,
                material_1.MatButtonModule,
                material_1.MatSnackBarModule
                // ApolloModule.forRoot(client)
            ],
        })
    ], AuthModule);
    return AuthModule;
}());
exports.AuthModule = AuthModule;
//# sourceMappingURL=auth.module.js.map