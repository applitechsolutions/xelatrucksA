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
    },
    {
      titulo: 'Reporte Cuadros',
      icono: 'menu-icon fas fa-file-invoice',
      submenu: [
        { titulo: 'Listar Pedidos', url: '/gtrips' },
        { titulo: 'Crear Pedido', url: '/order/new' }
      ]
    }
  ];

  menuTaller: any = [
    {
      titulo: 'Vehículos',
      icono: 'menu-icon fas fa-truck',
      submenu: [
        { titulo: 'Listar Vehículos', url: '/vehicles' },
        { titulo: 'Crear Vehículo', url: '/vehicle/new' }
      ]
    },
    {
      titulo: 'Mantenimientos',
      icono: 'menu-icon fas fa-tools',
      submenu: [
        { titulo: 'Listar Mantenimientos', url: '/maintenances' },
        { titulo: 'Crear Mantenimiento', url: '/maintenance/new' },
        { titulo: 'Tipos', url: '/typeMaintenances'}
      ]
    },
    {
      titulo: 'Repuestos',
      icono: 'menu-icon fas fa-cogs',
      submenu: [
        { titulo: 'Inventario', url: '/parts' },
        { titulo: 'Crear Repuesto', url: '/part/new' }
      ]
    },
    {
      titulo: 'Compras',
      icono: 'menu-icon fas fa-shopping-cart',
      submenu: [
        { titulo: 'Nueva Compra', url: '/buySpare/new' },
        { titulo: 'Historial de Compras', url: '/buySpares' }
      ]
    },
    {
      titulo: 'Proveedores',
      icono: 'menu-icon fas fa-industry',
      submenu: [
        { titulo: 'Listar Proveedores', url: '/autoProviders' },
        { titulo: 'Crear Proveedor', url: '/autoProvider/new' }
      ]
    },
    {
      titulo: 'Mecánicos',
      icono: 'menu-icon fas fa-user-cog',
      submenu: [
        { titulo: 'Listado Mecánicos', url: '/mechs' },
        { titulo: 'Crear Mecánico', url: '/mech/new' }
      ]
    }
  ];

  constructor() { }
}
