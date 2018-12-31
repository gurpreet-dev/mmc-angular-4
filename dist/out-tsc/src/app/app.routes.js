"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var home_component_1 = require("./home/home.component");
var todo_list_component_1 = require("./Todos/Components/todo-list/todo-list.component");
var todo_form_component_1 = require("./Todos/Components/todo-form/todo-form.component");
var auth_service_1 = require("./auth/auth.service");
exports.AppRoutes = [
    { path: '', component: home_component_1.HomeComponent },
    { path: 'todos', component: todo_list_component_1.TodoListComponent },
    { path: 'create', component: todo_form_component_1.TodoFormComponent },
    { path: 'auth', loadChildren: './auth#AuthModule', canActivate: [auth_service_1.authService], data: { loggedin: 'no' } },
    { path: 'live', loadChildren: './live#LiveModule' },
];
//# sourceMappingURL=app.routes.js.map