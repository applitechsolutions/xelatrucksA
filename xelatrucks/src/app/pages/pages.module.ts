import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { PAGES_ROUTES } from './pages.routes';

// Pipe Module
import { PipesModule } from '../pipes/pipes.module';

// temporal
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './users/user.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { VehicleComponent } from './vehicles/vehicle.component';
import { PartsComponent } from './parts/parts.component';
import { PartComponent } from './parts/part.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderComponent } from './orders/order.component';
import { AutoProvidersComponent } from './auto-providers/auto-providers.component';
import { AutoProviderComponent } from './auto-providers/auto-provider.component';
import { BuySparesComponent } from './buy-spares/buy-spares.component';
import { BuySpareComponent } from './buy-spares/buy-spare.component';
import { MechanicsComponent } from './mechanics/mechanics.component';
import { MechanicComponent } from './mechanics/mechanic.component';
import { NgxLoadingModule } from 'ngx-loading';
import { MaintenancesComponent } from './maintenances/maintenances.component';
import { MaintenanceComponent } from './maintenances/maintenance.component';
import { GtripsComponent } from './gtrips/gtrips.component';
import { TypeMaintenancesComponent } from './type-maintenances/type-maintenances.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeComponent } from './employees/employee.component';
import { GasolinesComponent } from './gasolines/gasolines.component';
import { CpcustomersComponent } from './cpcustomers/cpcustomers.component';
import { CustomersComponent } from './customers/customers.component';
import { GbillsComponent } from './gbills/gbills.component';
import { GbillComponent } from './gbills/gbill.component';
import { TypeTripsComponent } from './type-trips/type-trips.component';
import { RepairsComponent } from './repairs/repairs.component';
import { DestinationsComponent } from './destinations/destinations.component';
import { DestinationComponent } from './destinations/destination.component';
import { WtripsComponent } from './wtrips/wtrips.component';
import { WtripComponent } from './wtrips/wtrip.component';
import { TypeTripComponent } from './type-trips/type-trip.component';
import { OrdersFinishComponent } from './orders/orders-finish.component';
import { GtripComponent } from './gtrips/gtrip.component';
import { ReportsModule } from '../reports/reports.module';
import { WbillComponent } from './wbills/wbill.component';
import { WbillsComponent } from './wbills/wbills.component';
import { KtripsComponent } from './ktrips/ktrips.component';
import { KtripComponent } from './ktrips/ktrip.component';
import { DestTanksComponent } from './destTanks/dest-tanks.component';
import { DestTankComponent } from './destTanks/dest-tank.component';
import { TbillsComponent } from './tbills/tbills.component';
import { TbillComponent } from './tbills/tbill.component';
import { SalesComponent } from './sales/sales.component';
import { SaleComponent } from './sales/sale.component';
import { CdOrdersComponent } from './cd-orders/cd-orders.component';
import { CdOrderComponent } from './cd-orders/cd-order.component';
import { CdStockComponent } from './cd-storage/cd-stock.component';
import { MaterialsComponent } from './materials/materials.component';
import { MaterialComponent } from './materials/material.component';
import { CdPurchaseComponent } from './cd-purchases/cd-purchase.component';
import { CdPurchasesComponent } from './cd-purchases/cd-purchases.component';
import { TobePaidsComponent } from './cd-purchases/tobe-paids.component';
import { DespachoComponent } from './prints/despacho/despacho.component';
import { CdReportsComponent } from './cd-reports/cd-reports.component';
import { CashCDComponent } from './cashBox/cash-cd.component';
import { MenuComponent } from './reports/menu.component';
import { PurchasesByProvidersComponent } from './reports/taller/purchases-by-providers/purchases-by-providers.component';
import { GasConsumptionsComponent } from './reports/taller/gas-consumptions/gas-consumptions.component';
import { KmByVehiclesComponent } from './reports/transporte/km-by-vehicles/km-by-vehicles.component';
import { KmByDestinationsComponent } from './reports/transporte/km-by-destinations/km-by-destinations.component';
import { WtripsHistoryComponent } from './wtrips/wtrips-history.component';
import { GtripModalComponent } from './gtrips/gtrip-modal/gtrip-modal.component';

@NgModule({
        declarations: [
                DashboardComponent,
                UsersComponent,
                UserComponent,
                ProfileComponent,
                VehiclesComponent,
                VehicleComponent,
                PartsComponent,
                PartComponent,
                OrderComponent,
                OrdersComponent,
                AutoProvidersComponent,
                AutoProviderComponent,
                BuySparesComponent,
                BuySpareComponent,
                MechanicsComponent,
                MechanicComponent,
                MaintenancesComponent,
                MaintenanceComponent,
                GtripsComponent,
                TypeMaintenancesComponent,
                EmployeesComponent,
                EmployeeComponent,
                GasolinesComponent,
                CpcustomersComponent,
                CustomersComponent,
                GbillsComponent,
                GbillComponent,
                TypeTripsComponent,
                RepairsComponent,
                DestinationsComponent,
                DestinationComponent,
                WtripsComponent,
                WtripComponent,
                TypeTripComponent,
                OrdersFinishComponent,
                GtripComponent,
                WbillComponent,
                WbillsComponent,
                KtripsComponent,
                KtripComponent,
                DestTanksComponent,
                DestTankComponent,
                TbillsComponent,
                TbillComponent,
                SalesComponent,
                SaleComponent,
                CdOrdersComponent,
                CdOrderComponent,
                CdStockComponent,
                MaterialsComponent,
                MaterialComponent,
                TobePaidsComponent,
                CdPurchasesComponent,
                CdPurchaseComponent,
                DespachoComponent,
                CdReportsComponent,
                CashCDComponent,
                MenuComponent,
                PurchasesByProvidersComponent,
                GasConsumptionsComponent,
                KmByVehiclesComponent,
                KmByDestinationsComponent,
                WtripsHistoryComponent,
                GtripModalComponent,
        ],
        exports: [
                DashboardComponent,
                UserComponent
        ],
        imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
                SharedModule,
                PAGES_ROUTES,
                PipesModule,
                ReportsModule,
                NgxLoadingModule.forRoot({})
        ]
})

export class PagesModule { }
