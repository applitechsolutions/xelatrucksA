import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  usuario: User;
  token: string;

  constructor( 
    public http: HttpClient,
    public Router: Router
    ) {
    console.log('Servicio de usuario listo');
    this.cargarStorage();
  }

  estaLogueado() {
    return (this.token.length > 5) ? true : false;
  }

  cargarStorage() {

    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
    } else {
      this.token = '';
      this.usuario = null;
    }

  }

  guardarStorage( id: string, token: string, usuario: User) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token );
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuario = usuario;
    this.token = token;
  }

  logout() {
    this.usuario = null;
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    this.Router.navigate(['/login']);
  }

  login( usuario: User, recordar: boolean = false ) {

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICES + '/login';
    return this.http.post(url, usuario)
      .pipe( map( (resp: any) => {
        this.guardarStorage(resp.id, resp.token, resp.usuario);

        return true;
      }));
  }

  crearUsuario( usuario: User) {

    const url = URL_SERVICES + '/usuario';

    return this.http.post(url, usuario)
      .pipe( map( (resp: any) => {
        swal('Usuario Creado', usuario.email, 'success')
        return resp.usuario;
      }));

  }

  cargarUsuarios(desde: number = 0){
    const url = URL_SERVICES + '/usuario?desde=' + desde;
    return this.http.get(url);
  }

  buscarUsuarios( termino: string) {
    const url = URL_SERVICES + '/search/coleccion/users/' + termino;

    return this.http.get(url)
    .pipe(
      map( (resp: any) => resp.users));
  }

  
}
