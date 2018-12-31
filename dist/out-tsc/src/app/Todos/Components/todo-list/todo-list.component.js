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
// Import the DataService
var data_service_1 = require("./../../Services/data.service");
var http_1 = require("@angular/http");
var TodoListComponent = (function () {
    function TodoListComponent(_dataService, http) {
        var _this = this;
        this._dataService = _dataService;
        this.http = http;
        this.todos = [];
        this.todo = {};
        this._dataService.getTodos()
            .subscribe(function (res) { return _this.todos = res; });
    }
    TodoListComponent.prototype.ngOnInit = function () { };
    TodoListComponent.prototype.onTodoDelete = function (todoId) {
        var _this = this;
        this._dataService.deleteTodo(todoId)
            .subscribe(function (res) {
            _this.todos = _this.todos.filter(function (todo) {
                return todo._id != todoId;
            });
            console.log(res);
        });
    };
    TodoListComponent = __decorate([
        core_1.Component({
            selector: 'todo-list',
            templateUrl: './todo-list.component.html',
            styleUrls: ['./todo-list.component.css']
        }),
        __metadata("design:paramtypes", [data_service_1.DataService, http_1.Http])
    ], TodoListComponent);
    return TodoListComponent;
}());
exports.TodoListComponent = TodoListComponent;
//# sourceMappingURL=todo-list.component.js.map