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
var live_routes_1 = require("./live.routes");
var broadcast_component_1 = require("./broadcast/broadcast.component");
var view_component_1 = require("./view/view.component");
var now_component_1 = require("./now/now.component");
var LiveModule = (function () {
    function LiveModule() {
    }
    LiveModule.routes = live_routes_1.routes;
    LiveModule = __decorate([
        core_1.NgModule({
            declarations: [
                /**
                 * Components / Directives/ Pipes
                 */
                broadcast_component_1.BroadcastComponent,
                view_component_1.ViewComponent,
                now_component_1.NowComponent
            ],
            imports: [
                common_1.CommonModule,
                forms_1.FormsModule,
                router_1.RouterModule.forChild(live_routes_1.routes),
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
    ], LiveModule);
    return LiveModule;
}());
exports.LiveModule = LiveModule;
//# sourceMappingURL=live.module.js.map