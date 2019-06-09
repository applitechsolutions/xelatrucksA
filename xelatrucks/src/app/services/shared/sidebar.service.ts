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
    }
  ];

  menuViajes: any = [
    {
      titulo: 'Pedidos',
      icono: 'menu-icon fas fa-file-invoice',
      submenu: [
        { titulo: 'Listar Pedidos', url: '/orders' },
        { titulo: 'Crear Pedido', url: '/order/new' }
      ]
    }
  ];

  menuTaller: any = [
    {
      titulo: 'Vehículos',
      icono: 'menu-icon fas fa-truck',
      submenu: [
        { titulo: 'Listar vehículos', url: '/vehicles' },
        { titulo: 'Crear vehículo', url: '/vehicle/new' }
      ]
    },
    {
      titulo: 'Repuestos',
      icono: 'menu-icon fas fa-cogs',
      submenu: [
        { titulo: 'Listar Repuestos', url: '/parts' }
      ]
    }
  ];

  constructor() { }
}
