"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var broadcast_component_1 = require("./broadcast/broadcast.component");
var view_component_1 = require("./view/view.component");
var now_component_1 = require("./now/now.component");
var auth_service_1 = require("../auth/auth.service");
exports.routes = [
    {
        path: '', children: [
            { path: 'broadcast', component: broadcast_component_1.BroadcastComponent, canActivate: [auth_service_1.authService], data: { loggedin: 'yes' } },
            //{ path: 'view/:id', component: ViewComponent , canActivate:[authService], data: {loggedin: 'no'} },
            { path: 'view/:id', component: view_component_1.ViewComponent },
            { path: 'now', component: now_component_1.NowComponent }
        ]
    },
];
//# sourceMappingURL=live.routes.js.map