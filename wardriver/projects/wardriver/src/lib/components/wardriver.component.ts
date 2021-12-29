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

    async delay(ms: number) {
        await new Promise(resolve => setTimeout(()=>resolve(ms), ms)).then(()=>console.log("fired"));
    }

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
            action: 'status_file',
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

    set_aggro(): void {
        let pineAP_aggro_settings = {
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
            console.log(pineAP_aggro_settings);
            console.log(resp);
        });
    }

    run_scand(): void {
        this.set_aggro();
        // stop active scans
        this.API.APIPost('/api/recon/stop', {} , (resp) => {
            console.log('>active scans stopped');
        });
        
        this.API.APIPost('/api/recon/start', { 'live': false, 'scan_time': 0, 'band': '0' }, (resp) => {
            console.log('>starting recon scan:');
            //console.log(resp);
        });

        this.API.setBusy();
        this.delay(3000).then(any=>{
            this.API.setNotBusy();
            console.log('>no longer busy');
       });  
    }

    ngOnInit() { 
        this.populateTargetBSSIDs();
        this.get_status();
        this.run_scand();
    } 
}