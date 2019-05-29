import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( public http: HttpClient) {
    console.log('Servicio de usuario listo');
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
        localStorage.setItem('id', resp.id );
        localStorage.setItem('token', resp.token );
        localStorage.setItem('usuario', JSON.stringify(resp.usuario));

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


}
