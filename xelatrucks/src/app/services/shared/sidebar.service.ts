import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any = [
    {
      titulo: 'Usuarios',
      icono: 'menu-icon oi oi-person',
      submenu: [
        { titulo: 'Listar Usuarios', url: '/usuarios' },
        { titulo: 'Crear Nuevo', url: '/usuario/new' }
      ]
    }, {
      titulo: 'Vehículos',
      icono: 'menu-icon fas fa-truck',
      submenu: [
        { titulo: 'Listar vehículos', url: '/vehicles' },
        { titulo: 'Crear vehículo', url: '/vehicle/new' }
      ]
    }
  ];

  constructor() { }
}
