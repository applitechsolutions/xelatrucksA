import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/service.index';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: []
})
export class UsersComponent implements OnInit {

  usuarios: User[] = [];
  desde: number = 0;
  totalRegistros: number = 0;

  constructor(public UsuarioService: UserService) { }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
  this.UsuarioService.cargarUsuarios(this.desde)
  .subscribe( resp =>{
  console.log(resp);
  });
  }

}
