import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WarDriverComponent } from './components/wardriver.component';
import { RouterModule, Routes } from '@angular/router';

import {MaterialModule} from './modules/material/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';

import {FormsModule} from '@angular/forms';

const routes: Routes = [
    { path: '', component: WarDriverComponent }
];

@NgModule({
    declarations: [WarDriverComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        MaterialModule,
        FlexLayoutModule,
        FormsModule
    ],
    exports: [WarDriverComponent]
})
export class wardriverModule { }
