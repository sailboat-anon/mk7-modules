import { Component, OnInit, NgModule } from '@angular/core'; 
import { ApiService } from '../services/api.service'; 
 
@Component({ 
    selector: 'lib-wardriver', 
    templateUrl: './wardriver.component.html', 
    styleUrls: ['./wardriver.component.css'] 
}) 

export class WarDriverComponent implements OnInit { 
    constructor(private API: ApiService) { } 
 
    apiResponse = 'Press the button above to get the version.'; 
    doAPIAction(): void { 
        this.API.APIGet('/api/status', (response) => { 
            this.apiResponse = response.versionString; 
        }) 
    } 
 
    ngOnInit() { 
    } 
}