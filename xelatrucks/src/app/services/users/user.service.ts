import { Injectable } from '@angular/core';
import { User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor( public http: HttpClient) {
    console.log('Servicio de usuario listo');
  }

  crearUsuario( usuario: User) {

    const url = URL_SERVICES + '/user';

    return this.http.post(url, usuario);

  }

}
