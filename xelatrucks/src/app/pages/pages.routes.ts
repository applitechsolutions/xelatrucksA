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
            // MANTENIMIENTOS
            { path: 'usuarios', component: UsersComponent, data: { titulo: 'Mantenimiento de Usuarios' } },
            { path: 'usuario/:id', component: UserComponent, data: { titulo: 'Actualizar Usuario' } },
            { path: '', redirectTo: '/dashboard', pathMatch: 'full'}
        ]
    },
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
