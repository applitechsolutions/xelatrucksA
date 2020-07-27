import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLoadingModule } from 'ngx-loading';
import { SharedModule } from '../shared/shared.module';

// IMPORTS
import { DataTableComponent } from '../components/dataTable/data-table.component';

import { SalesByAmountComponent } from './distribucion/sales-by-amount/sales-by-amount.component';
import { SalesBilledComponent } from './distribucion/sales-billed/sales-billed.component';
import { SalesNobillComponent } from './distribucion/sales-nobill/sales-nobill.component';
import { CanceledSalesComponent } from './distribucion/canceled-sales/canceled-sales.component';

@NgModule({
    declarations: [
        DataTableComponent,
        SalesByAmountComponent,
        SalesBilledComponent,
        SalesNobillComponent,
        CanceledSalesComponent,
    ],
    exports: [
        SalesByAmountComponent,
        SalesBilledComponent,
        SalesNobillComponent,
        CanceledSalesComponent,
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
