import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { SharedModule } from '../shared/shared.module';

// IMPORTS
import { DataTableComponent } from '../components/dataTable/data-table.component';

import { PurchasesByProvidersComponent } from './taller/purchasesByProviders/purchases-by-providers.component';
import { GasConsumptionsComponent } from './taller/gasConsumptions/gas-consumptions.component';
import { GreenTripsComponent } from './transporte/greenTrips/green-trips.component';
import { SalesByAmountComponent } from './distribucion/sales-by-amount/sales-by-amount.component';
import { SalesBilledComponent } from './distribucion/sales-billed/sales-billed.component';


@NgModule({
    declarations: [
        PurchasesByProvidersComponent,
        GasConsumptionsComponent,
        DataTableComponent,
        GreenTripsComponent,
        SalesByAmountComponent,
        SalesBilledComponent
    ],
    exports: [
        PurchasesByProvidersComponent,
        GasConsumptionsComponent,
        SalesByAmountComponent,
        SalesBilledComponent
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
