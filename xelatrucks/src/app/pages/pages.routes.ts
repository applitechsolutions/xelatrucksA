import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { Graficas1Component } from './graficas1/graficas1.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { UsersComponent } from './users/users.component';
import { UserComponent } from './users/user.component';
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
import { WtripsComponent } from './wtrips/wtrips.component';
import { WtripComponent } from './wtrips/wtrip.component';
import { TypeMaintenancesComponent } from './type-maintenances/type-maintenances.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeComponent } from './employees/employee.component';
import { GasolinesComponent } from './gasolines/gasolines.component';
import { CpcustomersComponent } from './cpcustomers/cpcustomers.component';
import { CustomersComponent } from './customers/customers.component';
import { GbillsComponent } from './gbills/gbills.component';
import { GbillComponent } from './gbills/gbill.component';
import { AdminGuard } from '../services/service.index';
import { TypeTripComponent } from './type-trips/type-trip.component';
import { TypeTripsComponent } from './type-trips/type-trips.component';
import { ReportsComponent } from './reports/reports.component';
import { RepairsComponent } from './repairs/repairs.component';

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
        canActivate: [VerificaTokenGuard, AdminGuard],
        data: { titulo: 'Mantenimiento de Usuarios' }
    },
    {
        path: 'usuario/:id',
        component: UserComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Crear Usuario' }
    },
    {
        path: 'reports',
        component: ReportsComponent,
        canActivate: [VerificaTokenGuard, AdminGuard],
        data: { titulo: 'Reportes' }
    },
    // TRANSPORTES
    {
        path: 'employees',
        component: EmployeesComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Mantenimiento de Empleados' }
    },
    {
        path: 'employee/:id',
        component: EmployeeComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Crear Empleado' }
    },
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
    {
        path: 'wtrip/:id',
        component: WtripComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Crear Viaje de Líneas' }
    },
    {
        path: 'wtrips',
        component: WtripsComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Mantenimiento de viaje de líneas' }
    },
    {
        path: 'typeTrip/:id',
        component: TypeTripComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Crear tipo de viaje' }
    },
    {
        path: 'typeTrips',
        component: TypeTripsComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Mantenimiento tipos de viajes' }
    },
    {
        path: 'CPcustomers',
        component: CpcustomersComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Mantenimiento de Clientes' }
    },
    {
        path: 'gbills',
        component: GbillsComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Facturas de Reporte de Cuadros'}
    },
    {
        path: 'gbill/:id',
        component: GbillComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Nueva Factura'}
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
    {
        path: 'gasolines',
        component: GasolinesComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Cupones de combustible' }
    },
    {
        path: 'repairs',
        component: RepairsComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Reparaciones y ajustes' }
    },
    // CENTRO DE DISTRIBUCION
    {
        path: 'customers',
        component: CustomersComponent,
        canActivate: [VerificaTokenGuard],
        data: { titulo: 'Mantenimiento de Clientes' }
    },
    { path: '', redirectTo: '/dashboard', pathMatch: 'full'}
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
