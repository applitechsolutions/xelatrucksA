import { Injectable } from '@angular/core';
import { URL_SERVICES } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user.model';
import { Part } from '../../models/part.model';
import swal from 'sweetalert';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PartService {

  usuario: User;
  token: string;

  constructor(public http: HttpClient) {
    this.cargarStorage();
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

  cargarRepuestos() {

    const url = URL_SERVICES + '/repuesto';
    return this.http.get(url);
  }

  crearRepuesto( part: Part) {

    const url = URL_SERVICES + '/repuesto/' + '5cfd7c0ad37998d31c7ca56a?token=' + this.token;

    return this.http.post(url, part)
      .pipe( map( (resp: any) => {
        const partDB = resp.repuesto;
        swal('Repuesto creado', partDB.desc, 'success');
        return resp;
      }));

  }
}
