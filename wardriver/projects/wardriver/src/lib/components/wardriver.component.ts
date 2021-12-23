import { Component, OnInit, NgModule } from '@angular/core'; 
import { ApiService } from '../services/api.service'; 
 
@Component({ 
    selector: 'lib-wardriver', 
    templateUrl: './wardriver.component.html', 
    styleUrls: ['./wardriver.component.css'] 
}) 

export class WarDriverComponent implements OnInit { 
    constructor(private API: ApiService) { 
    }
    ap_channel = '11';
    autostart = true;
    autostartPineAP = true;
    public apiResponse = 'Unfulfilled Response';
    // targetBSSID
    // GET /api/pineap/ssids

    populateTargetBSSIDs(): void {
        this.API.APIGet('/api/pineap/ssids', (resp) => {
            this.apiResponse = resp.ssids;
            console.log('HERE');
            console.log(resp.ssids);
            console.log('THERE');
        });
    }
    doAPIAction(): void {
        this.API.request({
            module: 'wardriver',
            action: 'hello_world',
        }, (response) => {
            this.apiResponse = response;
        })
    }
    /*
    setToAggro(): void {
        let settingsMap = new Map<string,string | Map<string, string | boolean>>();
        settingsMap.set('mode','advanced');
        let settings = new Map<string, string | boolean>([
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
        settingsMap.set('settings', settings); */
        /*this.API.APIGet('/api/status', (response) => { 
            this.apiResponse = response.versionString; 
        })
        */
       /*
       console.log(settingsMap); 
    }
 */
    ngOnInit() { 
        this.populateTargetBSSIDs();
    } 
}