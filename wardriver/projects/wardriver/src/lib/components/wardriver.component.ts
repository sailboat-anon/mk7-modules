import { Component, OnInit, NgModule } from '@angular/core'; 
import { ApiService } from '../services/api.service'; 
import { RootObject, Header, Message } from '../interfaces/status_interface';

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
    json_frontend: RootObject;

    populateTargetBSSIDs(): void {
        this.API.APIGet('/api/pineap/ssids', (resp) => {
            this.apiResponse = resp.ssids;
        });
    }
 
    get_status_file_name(): string {
        this.API.request({
            module: 'wardriver',
            action: 'status_window_setup',
        }, (resp) => {
            this.statusFileName = resp;
        })
        return this.statusFileName;
    }

    get_status_file(statusFileName: string): any {
        this.API.request({
            module: 'wardriver',
            action: 'status_file',
            file_name: statusFileName,
        }, (resp) => {
            let json_file: RootObject[] = resp;
            console.log(json_file);
            console.log(statusFileName);
        })
    }

    get_status(): void {
        let statusFileName: string = this.get_status_file_name();
        console.log(statusFileName);
        this.get_status_file(statusFileName);
    }

    ngOnInit() { 
        this.populateTargetBSSIDs();
        this.get_status();
    } 
}