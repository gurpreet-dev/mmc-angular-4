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
var TodoFormComponent = (function () {
    function TodoFormComponent(_dataService) {
        var _this = this;
        this._dataService = _dataService;
        this.todos = [];
        this.todo = {
            title: '',
            text: ''
        };
        this._dataService.getTodos()
            .subscribe(function (res) { return _this.todos = res; });
    }
    TodoFormComponent.prototype.onSubmit = function () {
        this._dataService.createTodo(this.todo)
            .subscribe(function (res) {
            console.log(res);
        });
    };
    TodoFormComponent.prototype.ngOnInit = function () {
    };
    TodoFormComponent = __decorate([
        core_1.Component({
            selector: 'todo-form',
            templateUrl: './todo-form.component.html',
            styleUrls: ['./todo-form.component.css']
        }),
        __metadata("design:paramtypes", [data_service_1.DataService])
    ], TodoFormComponent);
    return TodoFormComponent;
}());
exports.TodoFormComponent = TodoFormComponent;
//# sourceMappingURL=todo-form.component.js.map