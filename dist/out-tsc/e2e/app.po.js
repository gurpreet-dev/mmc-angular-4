"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var protractor_1 = require("protractor");
var MeanPage = (function () {
    function MeanPage() {
    }
    MeanPage.prototype.navigateTo = function () {
        return protractor_1.browser.get('/');
    };
    MeanPage.prototype.getParagraphText = function () {
        return protractor_1.element(protractor_1.by.css('app-root h1')).getText();
    };
    return MeanPage;
}());
exports.MeanPage = MeanPage;
//# sourceMappingURL=app.po.js.map