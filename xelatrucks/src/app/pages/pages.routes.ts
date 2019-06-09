import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './users/user.component';
import { LoginGuardGuard } from '../services/guards/login-guard.guard';
import { ProfileComponent } from './profile/profile.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { VehicleComponent } from './vehicles/vehicle.component';
import { PartsComponent } from './parts/parts.component';
import { PartComponent } from './parts/part.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderComponent } from './orders/order.component';



const pagesRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        canActivate: [ LoginGuardGuard ],
        children: [
            { path: 'dashboard', component: DashboardComponent, data: { titulo: 'Dashboard' } },
            { path: 'progress', component: ProgressComponent, data: { titulo: 'ProgressBar' } },
            { path: 'graficas1', component: Graficas1Component, data: { titulo: 'Gráficas' } },
            { path: 'promesas', component: PromesasComponent, data: { titulo: 'Promesas' } },
            { path: 'rxjs', component: RxjsComponent, data: { titulo: 'RxJs' } },
            { path: 'profile', component: ProfileComponent, data: { titulo: 'Perfil de usuario' } },
            // MANTENIMIENTOS
            { path: 'usuarios', component: UsersComponent, data: { titulo: 'Mantenimiento de Usuarios' } },
            { path: 'usuario/:id', component: UserComponent, data: { titulo: 'Crear Usuario' } },
            // TRANSPORTES
            { path: 'orders', component: OrdersComponent, data: { titulo: 'Mantenimiento de Pedidos' } },
            { path: 'order/:id', component: OrderComponent, data: { titulo: 'Crear Pedido' } },
            // TALLER
            { path: 'vehicles', component: VehiclesComponent, data: { titulo: 'Mantenimiento de Vehículos' } },
            { path: 'vehicle/:id', component: VehicleComponent, data: { titulo: 'Crear Vehículo' } },
            { path: 'parts', component: PartsComponent, data: { titulo: 'Mantenimiento de Repuestos' } },
            { path: 'part/:id', component: PartComponent, data: { titulo: 'Crear Repuesto' } },
            { path: '', redirectTo: '/dashboard', pathMatch: 'full'}
        ]
    },
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
