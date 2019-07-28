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
import { AutoProvidersComponent } from './auto-providers/auto-providers.component';
import { AutoProviderComponent } from './auto-providers/auto-provider.component';
import { BuySparesComponent } from './buy-spares/buy-spares.component';
import { BuySpareComponent } from './buy-spares/buy-spare.component';
import { VerificaTokenGuard } from '../services/service.index';
import { MechanicsComponent } from './mechanics/mechanics.component';
import { MechanicComponent } from './mechanics/mechanic.component';
import { MaintenancesComponent } from './maintenances/maintenances.component';
import { MaintenanceComponent } from './maintenances/maintenance.component';
import { GtripsComponent } from './gtrips/gtrips.component';
import { TypeMaintenancesComponent } from './type-maintenances/type-maintenances.component';

const pagesRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Dashboard' }
    },
    {
        path: 'progress',
        component: ProgressComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'ProgressBar' }
    },
    {
        path: 'graficas1',
        component: Graficas1Component,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Gráficas' }
    },
    {
        path: 'promesas',
        component: PromesasComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Promesas' }
    },
    {
        path: 'rxjs',
        component: RxjsComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'RxJs' }
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Perfil de usuario' }
    },
    // MANTENIMIENTOS
    {
        path: 'usuarios',
        component: UsersComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Mantenimiento de Usuarios' }
    },
    {
        path: 'usuario/:id',
        component: UserComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Crear Usuario' }
    },
    // TRANSPORTES
    {
        path: 'orders',
        component: OrdersComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Mantenimiento de Pedidos' }
    },
    {
        path: 'order/:id',
        component: OrderComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Crear Pedido' }
    },
    {
        path: 'gtrips',
        component: GtripsComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Reporte de Cuadros' }
    },
    // TALLER
    {
        path: 'buySpares',
        component: BuySparesComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Historial de compras' }
    },
    {
        path: 'buySpare/:id',
        component: BuySpareComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Nueva Compra' }
    },
    {
        path: 'autoProviders',
        component: AutoProvidersComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Mantenimiento de Proveedores' }
    },
    {
        path: 'autoProvider/:id',
        component: AutoProviderComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Crear Proveedor' }
    },
    {
        path: 'vehicles', component:
        VehiclesComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Mantenimiento de Vehículos' }
    },
    {
        path: 'vehicle/:id',
        component: VehicleComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Crear Vehículo' }
    },
    {
        path: 'parts',
        component: PartsComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Mantenimiento de Repuestos' }
    },
    {
        path: 'part/:id',
        component: PartComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Crear Repuesto' }
    },
    {
        path: 'mechs',
        component: MechanicsComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Mantenimiento de Mecánicos' }
    },
    {
        path: 'mech/:id',
        component: MechanicComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Crear Mecánico' }
    },
    {
        path: 'maintenances',
        component: MaintenancesComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Mantenimientos de vehículos' }
    },
    {
        path: 'maintenance/:id',
        component: MaintenanceComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Crear Mantenimiento' }
    },
    {
        path: 'typeMaintenances',
        component: TypeMaintenancesComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Tipos de Mantenimientos' }
    },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full'}
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
