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
    updateLoop = null
    statusWindowMsg = "Berserker module locked and loaded!";

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
                this.statusWindowMsg = response;
            }
        });
    }
    
    ngOnInit() { 
        this.updateLoop = setInterval(() => {
            this.get_berserker_scan_status();
        }, 5000);
    }
    ngOnDestroy() {
        clearInterval(this.updateLoop);
    }
}