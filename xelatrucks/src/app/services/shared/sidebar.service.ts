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
        {titulo: 'Graficas',  url: '/graficas1'}
      ]
    }
  ];

  constructor() { }
}
