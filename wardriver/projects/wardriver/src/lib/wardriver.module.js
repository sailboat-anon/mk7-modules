"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.wardriverModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var wardriver_component_1 = require("./components/wardriver.component");
var router_1 = require("@angular/router");
var material_module_1 = require("./modules/material/material.module");
var flex_layout_1 = require("@angular/flex-layout");
var forms_1 = require("@angular/forms");
var routes = [
    { path: '', component: wardriver_component_1.WarDriverComponent }
];
var wardriverModule = /** @class */ (function () {
    function wardriverModule() {
    }
    wardriverModule = __decorate([
        (0, core_1.NgModule)({
            declarations: [wardriver_component_1.WarDriverComponent],
            imports: [
                common_1.CommonModule,
                router_1.RouterModule.forChild(routes),
                material_module_1.MaterialModule,
                flex_layout_1.FlexLayoutModule,
                forms_1.FormsModule
            ],
            exports: [wardriver_component_1.WarDriverComponent]
        })
    ], wardriverModule);
    return wardriverModule;
}());
exports.wardriverModule = wardriverModule;
