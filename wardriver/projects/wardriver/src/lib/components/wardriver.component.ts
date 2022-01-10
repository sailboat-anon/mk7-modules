import { Component, OnInit } from '@angular/core'; 
import { ApiService } from '../services/api.service'; 
import {MatTabsModule} from '@angular/material/tabs'; 
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

    basic_wardriver_flow(): void {
        this.API.request({
            module: 'wardriver',
            action: 'basic_wardriver_flow',
        }, (resp) => {
            
        });
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

    scan_toggle_checked(): void {
        this.API.request({
            module: 'wardriver',
            action: 'scan_toggle_checked'
        }, (resp) => {
            if (resp == true) {
                this.scan_toggle = true;
            }
            else {
                this.scan_toggle = false;
            }
        });
    }

    ngOnInit() { 
        this.updateLoop = setInterval(() => {
            this.get_berserker_scan_status();
            this.scan_toggle_checked();
        }, 5000);
    }
    ngOnDestroy() {
        clearInterval(this.updateLoop);
    }
}