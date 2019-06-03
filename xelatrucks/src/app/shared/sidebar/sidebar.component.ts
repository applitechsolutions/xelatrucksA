import { Component, OnInit } from '@angular/core';
import { SidebarService, UserService } from 'src/app/services/service.index';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  usuario: User;
  role: string = 'Usuario';

  constructor( public _sidebar: SidebarService, public UserService: UserService ) { }

  ngOnInit() {
    this.usuario = this.UserService.usuario;
    if (this.usuario.role === 'ADMIN_ROLE') {
      this.role = 'Administrador';
    } else {
      this.role = 'Operativo';
    }
  }

}
