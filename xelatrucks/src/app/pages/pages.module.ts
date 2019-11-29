import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { PAGES_ROUTES } from './pages.routes';

// ng2-charts
import { ChartsModule } from 'ng2-charts';

// Pipe Module
import { PipesModule } from '../pipes/pipes.module';

// temporal
import { GraficoDonaComponent } from '../components/grafico-dona/grafico-dona.component';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
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
import { ReportsComponent } from './reports/reports.component';
import { RepairsComponent } from './repairs/repairs.component';
import { DestinationsComponent } from './destinations/destinations.component';
import { DestinationComponent } from './destinations/destination.component';
import { WtripsComponent } from './wtrips/wtrips.component';
import { WtripComponent } from './wtrips/wtrip.component';
import { TypeTripComponent } from './type-trips/type-trip.component';
import { OrdersFinishComponent } from './orders/orders-finish.component';


@NgModule({
    declarations: [
        DashboardComponent,
        ProgressComponent,
        Graficas1Component,
        GraficoDonaComponent,
        PromesasComponent,
        RxjsComponent,
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
        ReportsComponent,
        RepairsComponent,
        DestinationsComponent,
        DestinationComponent,
        WtripsComponent,
        WtripComponent,
        TypeTripComponent,
        OrdersFinishComponent
    ],
    exports: [
        DashboardComponent,
        ProgressComponent,
        Graficas1Component,
        UserComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SharedModule,
        PAGES_ROUTES,
        ChartsModule,
        PipesModule,
        NgxLoadingModule.forRoot({})
    ]
})

export class PagesModule { }
