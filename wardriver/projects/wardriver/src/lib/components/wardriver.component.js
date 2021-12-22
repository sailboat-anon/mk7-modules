"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.WarDriverComponent = void 0;
var core_1 = require("@angular/core");
var WarDriverComponent = /** @class */ (function () {
    function WarDriverComponent(API) {
        this.API = API;
    }
    WarDriverComponent.prototype.setToAggro = function () {
        var settingsMap = new Map();
        settingsMap.set('mode', 'advanced');
        var settings = new Map([
            ['ap_channel', '11'],
            ['autostart', true],
            ['autostartPineAP', true],
            ['beacon_interval', 'AGGRESSIVE'],
            ['beacon_response_interval', 'AGGRESSIVE'],
            ['beacon_responses', true],
            ['broadcast_ssid_pool', true],
            ['capture_ssids', true],
            ['connect_notifications', false],
            ['disconnect_notifications', false],
            ['enablePineAP', true],
            ['karma', true],
            ['logging', true],
            ['pineap_mac', '00:13:37:A8:1C:BB'],
            ['target_mac', 'FF:FF:FF:FF:FF:FF']
        ]);
        settingsMap.set('settings', settings);
        /*this.API.APIGet('/api/status', (response) => {
            this.apiResponse = response.versionString;
        })
        */
        console.log(settingsMap);
    };
    WarDriverComponent.prototype.ngOnInit = function () {
    };
    WarDriverComponent = __decorate([
        (0, core_1.Component)({
            selector: 'lib-wardriver',
            templateUrl: './wardriver.component.html',
            styleUrls: ['./wardriver.component.css']
        })
    ], WarDriverComponent);
    return WarDriverComponent;
}());
exports.WarDriverComponent = WarDriverComponent;
/*
$pineAP_aggro_settings = array('mode' => 'advanced', 'settings' => array(
        'ap_channel' => '11',
        'autostart' => true,
        'autostartPineAP' => true,
        'beacon_interval' => 'AGGRESSIVE',
        'beacon_response_interval' => 'AGGRESSIVE',
        'beacon_responses' => true,
        'broadcast_ssid_pool' => true,
        'capture_ssids' => true,
        'connect_notifications' => false,
        'disconnect_notifications' => false,
        'enablePineAP' => true,
        'karma' => true,
        'logging' => true,
        'pineap_mac' => '00:13:37:A8:1C:BB',
        'target_mac' => 'FF:FF:FF:FF:FF:FF'
    ));
*/ 
