import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any = [
    {
      titulo: 'Curso',
      icono: 'menu-icon oi oi-browser',
      submenu: [
        { titulo: 'Progress', url: '/progress' },
        { titulo: 'Graficas',  url: '/graficas1' },
        { titulo: 'Promesas',  url: '/promesas' },
        { titulo: 'RxJs',  url: '/rxjs' }
      ]
    },
    {
      titulo: 'Usuarios',
      icono: 'menu-icon oi oi-person',
      submenu: [
        { titulo: 'Listar Usuarios', url: '/usuarios' },
        { titulo: 'Crear Nuevo', url: '/usuario/new' }
      ]
    }
  ];

  constructor() { }
}
