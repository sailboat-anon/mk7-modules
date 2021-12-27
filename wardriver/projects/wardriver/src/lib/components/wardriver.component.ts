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
        }, (resp) => {
            console.log(resp);
        })
    }

    get_status(): void {
        this.get_status_file_name();
        this.get_status_file();
        //fp.readAsText(this.statusFileName);
        //this.fs.readFileSync(this.statusFileName, {encoding: 'json', flag: 'r'});
        //this.fp.readAsText(statusFileName);
        //let json_root_obj: RootObject[] = fp as RootObject[];
        //console.log(json_root_obj);
    }

    doAPIAction(): void {
        this.API.request({
            module: 'wardriver',
            action: 'hello_world',
        }, (response) => {
            this.apiResponse = response;
        })
    } 
    
    ngOnInit() { 
        this.populateTargetBSSIDs();
        this.get_status();
    } 
}