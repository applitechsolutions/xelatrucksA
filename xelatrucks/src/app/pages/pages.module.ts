import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { PAGES_ROUTES } from './pages.routes';

// ng2-charts
import { ChartsModule } from 'ng2-charts';

// Pipe Module
import { PipesModule } from '../pipes/pipes.module';

// temporal
import { GraficoDonaComponent } from '../components/grafico-dona/grafico-dona.component';
// import { NgSelectModule } from '@ng-select/ng-select';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './users/user.component';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ProfileComponent } from './profile/profile.component';
import { ModalUploadComponent } from '../components/modal-upload/modal-upload.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { VehicleComponent } from './vehicles/vehicle.component';
import { PartsComponent } from './parts/parts.component';
import { PartComponent } from './parts/part.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderComponent } from './orders/order.component';


@NgModule({
    declarations: [
        PagesComponent,
        DashboardComponent,
        ProgressComponent,
        Graficas1Component,
        GraficoDonaComponent,
        PromesasComponent,
        RxjsComponent,
        UsersComponent,
        UserComponent,
        ProfileComponent,
        ModalUploadComponent,
        VehiclesComponent,
        VehicleComponent,
        PartsComponent,
        PartComponent,
        OrderComponent,
        OrdersComponent
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
        HttpClientModule,
        SharedModule,
        PAGES_ROUTES,
        ChartsModule,
        PipesModule
    ]
})

export class PagesModule { }
