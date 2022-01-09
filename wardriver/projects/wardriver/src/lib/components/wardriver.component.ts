import { Component, OnInit } from '@angular/core'; 
import { ApiService } from '../services/api.service'; 
import {MatTabsModule} from '@angular/material/tabs'; 
import fs from 'fs';
import { Subscription, Observable, timer } from 'rxjs';

@Component({ 
    selector: 'lib-wardriver', 
    templateUrl: './wardriver.component.html', 
    styleUrls: ['./wardriver.component.css'] 
})

export class WarDriverComponent implements OnInit { 
    constructor(private API: ApiService) { }
    statusWindowMsg = "Berserker module locked and loaded!";
    subscription: Subscription;
    everyFiveSeconds: Observable<number> = timer(0, 5000);

    basic_wardriver_flow(): void {
        this.API.request({
            module: 'wardriver',
            action: 'basic_wardriver_flow',
        }, (resp) => {
            
        })
    }

    get_berserker_scan_status(): any {
        let outlog = '/tmp/wd-out.log';
        let errlog = '/tmp/wd-error.log';

        if (fs.existsSync(errlog)) {
            fs.readFile(errlog, 'utf8', (err, data) => {
                this.statusWindowMsg = data;
                console.log(data);
            });
        } 
        if (fs.existsSync(outlog)) {
            fs.readFile(errlog, 'utf8', (err, data) => {
                this.statusWindowMsg = data;
                console.log(data);
            });
        }
    }
    
    ngOnInit() { 
        this.subscription = this.everyFiveSeconds.subscribe(() => {
            this.get_berserker_scan_status();
        });
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}