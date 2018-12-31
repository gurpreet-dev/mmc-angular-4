"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var register_component_1 = require("./register/register.component");
var login_component_1 = require("./login/login.component");
exports.routes = [
    {
        path: '', children: [
            { path: 'register', component: register_component_1.RegisterComponent },
            { path: 'login', component: login_component_1.LoginComponent }
        ]
    },
];
//# sourceMappingURL=auth.routes.js.map