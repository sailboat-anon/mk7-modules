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

    get_status_file(): any {
        this.API.request({
            module: 'wardriver',
            action: 'get_status_file',
            file_name: this.statusFileName,
        }, (resp) => {
            let json_file: RootObject[] = resp;
            console.log(json_file);
        })
    }

    get_status(): void {
        this.get_status_file_name();
        this.get_status_file();
    }

    ngOnInit() { 
        this.populateTargetBSSIDs();
        this.get_status();
    } 
}