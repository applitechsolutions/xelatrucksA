import { Injectable } from '@angular/core';
import { URL_SERVICES } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/models/user.model';
import { Part } from '../../models/part.model';
import swal from 'sweetalert';
import { map } from 'rxjs/operators';
import { UserService } from '../users/user.service';

@Injectable({
  providedIn: 'root'
})
export class PartService {

  constructor(
    public http: HttpClient,
    public userS: UserService) {
   }

  cargarRepuestos() {

    const url = URL_SERVICES + '/repuesto';
    return this.http.get(url);
  }

  crearRepuesto( part: Part) {

    const url = URL_SERVICES + '/repuesto/' + '5cfd7c0ad37998d31c7ca56a?token=' + this.userS.token;

    return this.http.post(url, part)
      .pipe( map( (resp: any) => {
        const partDB = resp.repuesto;
        swal('Repuesto creado', partDB.desc, 'success');
        return resp;
      }));

  }
}
