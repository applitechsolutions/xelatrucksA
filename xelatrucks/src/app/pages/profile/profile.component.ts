import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/users/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  usuario: User;
  role: string;

  constructor(public userS: UserService) { }

  ngOnInit() {
    this.usuario = this.userS.usuario;
    if (this.usuario.role === 'ADMIN_ROLE') {
      this.role = 'Administrador';
    } else {
      this.role = 'Operativo';
    }
  }

  guardar( usuario: User){
    this.usuario.name = usuario.name;
    this.usuario.lastName = usuario.lastName;
    this.usuario.email = usuario.email;

    this.userS.actualizarUsuario( this.usuario )
    .subscribe( resp => {
        console.log(resp);
    });
  }

}
