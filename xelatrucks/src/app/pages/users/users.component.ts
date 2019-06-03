import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/service.index';
import { URL_SERVICES } from '../../config/config';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: []
})
export class UsersComponent implements OnInit {

  usuarios: User[] = [];
  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(public UsuarioService: UserService) { }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
  this.cargando = true;

  this.UsuarioService.cargarUsuarios(this.desde)
  .subscribe( (resp: any) => {
  this.totalRegistros = resp.total;
  this.usuarios = resp.usuarios;
  this.cargando = false;
  });
  }

  cambiarDesde(valor: number){
    const desde = this.desde + valor;

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuarios( termino: string){
    console.log(termino);

    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this.UsuarioService.buscarUsuarios(termino)
      .subscribe( (usuarios: User[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
    });
  }

}
