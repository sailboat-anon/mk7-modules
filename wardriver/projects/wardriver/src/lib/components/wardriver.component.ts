import { Component, OnInit } from '@angular/core'; 
import { ApiService } from '../services/api.service'; 
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
                let textarea = document.getElementById("status");
                textarea.scrollTop = textarea.scrollHeight;
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