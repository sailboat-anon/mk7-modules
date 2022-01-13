import { Component, OnInit } from '@angular/core'; 
import { ApiService } from '../services/api.service'; 
import { ReconResult, APResult, Client } from '../interfaces/reconresult.interface';
import {MatTabsModule} from '@angular/material/tabs'; 
import { stat } from 'fs';
//import { Observable, Subscription, timer } from 'rxjs.min.js'

@Component({ 
    selector: 'lib-wardriver', 
    templateUrl: './wardriver.component.html', 
    styleUrls: ['./wardriver.component.css'] 
})


export class WarDriverComponent implements OnInit { 
    constructor(private API: ApiService) { }
    updateLoop = null;
    statusWindowMsg = "Berserker module locked and loaded!";
    scan_toggle = false;
    reconResults: ReconResult;
    APResults: APResult;
    
    APResults_test: APResult = [{
        APResults: [{
                ssid: "",
                bssid: "00:C0:CA:86:E9:9C",
                encryption: 16794626,
                hidden: 1,
                wps: 0,
                channel: 11,
                signaType '{ APResults: { ssid: string; bssid: string; encryption: number; hidden: number; wps: number; channel: number; signal: number; data: number; last_seen: number; probes: { Int64: number; Valid: boolean; }; clients: { ...; }[]; }[]; }[]' is missing the following properties from type 'APResult': ssid, bssid, encryption, hidden, and 7 more.l: -79,
                data: 0,
                last_seen: 1642014843,
                probes: {
                    Int64: 0,
                    Valid: false
                },
                clients: null
            },
            {
                ssid: "",
                bssid: "08:36:C9:90:3C:C9",
                encryption: 16794626,
                hidden: 1,
                wps: 0,
                channel: 9,
                signal: -81,
                data: 0,
                last_seen: 1642015185,
                probes: {
                    Int64: 0,
                    Valid: false
                },
                clients: null
            },
            {
                ssid: "",
                bssid: "08:55:31:2B:9F:07",
                encryption: 16794626,
                hidden: 1,
                wps: 0,
                channel: 11,
                signal: -83,
                data: 0,
                last_seen: 1642014789,
                probes: {
                    Int64: 0,
                    Valid: false
                },
                clients: [{
                    client_mac: "74:96:37:08:68:CE",
                    ap_mac: "74:96:37:08:69:54",
                    ap_channel: 1,
                    data: 0,
                    broadcast_probes: {
                        Int64: 0,
                        Valid: true
                    },
                    direct_probes: {
                        Int64: 0,
                        Valid: true
                    },
                    last_seen: 1642013621
                }]
            },
            {
                ssid: "",
                bssid: "12:59:32:62:F3:49",
                encryption: 16794626,
                hidden: 1,
                wps: 1,
                channel: 2,
                signal: -69,
                data: 0,
                last_seen: 1642014846,
                probes: {
                    Int64: 0,
                    Valid: false
                },
                clients: null
            }
        ]
    }]
    
    clientResults: Client;
    wirelessLandscapeHeaders: any = ['ssid','bssid','encryption','hidden','wps','channel','signal','data','last_seen','probes','clients'];
// need to restructure the above AND reconResults data so it's like this ts example:  https://material.angular.io/components/table/examples
// start by removing the arrays from the dataset, add them later
    get_recon_scan_details(): void {
        if (this.scan_toggle) {
            this.API.request({
                module: 'wardriver',
                action: 'get_recon_scan_details',
            }, (resp) => {
                this.reconResults = resp;
                this.APResults = resp.APResults;
            });
        }
    }

    basic_berserker_flow(): void {
        if (this.scan_toggle) {
            this.API.request({
                module: 'wardriver',
                action: 'kill_berserker',
            }, (resp) => {
                
            });
        }
        else {
            this.API.request({
                module: 'wardriver',
                action: 'basic_berserker_flow',
            }, (resp) => {
                this.statusWindowMsg = "Berserker warming-up... Please wait 1-2 mins...";
            });
        }
    }

    get_berserker_scan_status(): void {
        this.API.request({
            module: 'wardriver',
            action: 'get_berserker_scan_status'
        }, (response) => {
            if (response.error === undefined) {
                this.statusWindowMsg = String(response);
            }
        });
    }

    scan_toggle_check(): void {
        this.API.request({
            module: 'wardriver',
            action: 'scan_toggle_check'
        }, (resp) => {
            if (resp == true) {
                this.scan_toggle = true;
                this.get_recon_scan_details();
            }
            else {
                this.scan_toggle = false;
            }
        });
    }

    ngOnInit() { 
        this.scan_toggle_check();
        this.updateLoop = setInterval(() => {
            this.get_berserker_scan_status();
        }, 5000);
    }
    ngOnDestroy() {
        clearInterval(this.updateLoop);
    }
}