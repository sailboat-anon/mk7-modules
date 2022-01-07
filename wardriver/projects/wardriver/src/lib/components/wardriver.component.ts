import { Component, OnInit } from '@angular/core'; 
import { ApiService } from '../services/api.service'; 

@Component({ 
    selector: 'lib-wardriver', 
    templateUrl: './wardriver.component.html', 
    styleUrls: ['./wardriver.component.css'] 
})

export class WarDriverComponent implements OnInit { 
    constructor(private API: ApiService) { }
    
    ngOnInit() { 
        
    }
}