import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/service.index';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  usuario: User;
  role: string;

  constructor(public UserService: UserService) { }

  ngOnInit() {
    this.usuario = this.UserService.usuario;
    if (this.usuario.role === 'ADMIN_ROLE') {
      this.role = 'Administrador';
    } else {
      this.role = 'Operativo';
    }
  }

}
