import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { SharedModule } from '../shared/shared.module';

// IMPORTS
import { DataTableComponent } from '../components/dataTable/data-table.component';

import { PurchasesByProvidersComponent } from './taller/purchasesByProviders/purchases-by-providers.component';
import { GasConsumptionsComponent } from './taller/gasConsumptions/gas-consumptions.component';


@NgModule({
    declarations: [
        PurchasesByProvidersComponent,
        GasConsumptionsComponent,
        DataTableComponent
    ],
    exports: [
        PurchasesByProvidersComponent,
        GasConsumptionsComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        NgxLoadingModule.forRoot({})
    ]
})

export class ReportsModule { }
