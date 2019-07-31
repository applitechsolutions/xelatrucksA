import { Injectable } from '@angular/core';
import { UserService } from '../users/user.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [];
  menuTaller: any[] = [];
  menuTransporte: any[] = [];
  menuDistribucion: any[] = [];
  menuContabilidad: any[] = [];

  constructor(
    public userS: UserService
  ) { }

  cargarMenu() {
    this.menu = this.userS.menuAdmin;
    this.menuTaller = this.userS.menuTaller;
    this.menuTransporte = this.userS.menuTransporte;
    this.menuDistribucion = this.userS.menuDistribucion;
    this.menuContabilidad = this.userS.menuContabilidad;
  }
}
