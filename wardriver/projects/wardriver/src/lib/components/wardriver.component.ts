import { Component, OnInit, NgModule } from '@angular/core'; 
import { ApiService } from '../services/api.service'; 
import { StatusRootObject, Header, Message } from '../interfaces/status.interface';

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

    run_scand(): void {
        const scan_opts = {
            "live":false,
            "scan_time":30,
            "band":"0"
        };

        const pineAP_aggro_settings = {
            //'mode': 'advanced', 
            //'settings': { 
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
           // }
        }

        this.API.APIPut('/api/pineap/settings', pineAP_aggro_settings, (resp) => {
            setTimeout(() => {  }, 3000);
            this.API.APIPost('/api/recon/stop', null, (resp) => {
                setTimeout(() => {  }, 3000);
                this.API.APIPost('/api/recon/start', scan_opts, (resp) => {
                    this.API.setBusy();
                    // notify end user of 30 second wait
                    setTimeout(() => {  console.log(this.API.setNotBusy()); }, 10000);
                    this.API.APIGet('/api/recon/scans/' + resp.scanID, (resp) => {
                        console.log(resp.APResults);
                    })
                })
            })
        });
    }

    ngOnInit() { 
        this.populateTargetBSSIDs();
        //this.get_status();
        this.run_scand();
    } 
}