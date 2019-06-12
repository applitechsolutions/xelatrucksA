import { Injectable } from '@angular/core';
import { URL_SERVICES } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { Part } from '../../models/part.model';
import swal from 'sweetalert';
import { map } from 'rxjs/operators';
import { UserService } from '../users/user.service';
import { AutoCellar } from '../../models/autoCellar';

@Injectable({
  providedIn: 'root'
})
export class PartService {

  constructor(
    public http: HttpClient,
    public userS: UserService
    ) {}

  cargarRepuestos() {

    const url = URL_SERVICES + '/repuesto';
    return this.http.get(url);
  }

  cargarRepuesto( id: string ) {
    const url = URL_SERVICES + '/repuesto/' + id;
    return this.http.get(url)
      .pipe(
        map( (resp: any) => resp.repuesto )
      );
  }

  crearRepuesto( part: Part ) {

    let url = URL_SERVICES + '/repuesto';

    if (part._id) {
      url += '/' + part._id;
      url += '?token=' + this.userS.token;

      return this.http.put(url, part )
        .pipe(
          map( (resp: any) => {
            const partDB = resp.repuesto;
            swal('Repuesto Actualizado', partDB.desc, 'success');
            return resp;
          }));

    } else {

        url += '/5d002da32a15453d044f71a9?token=' + this.userS.token;

        return this.http.post(url, part)
          .pipe( map( (resp: any) => {
            const partDB = resp.repuesto;
            swal('Repuesto creado', partDB.desc, 'success');
            return resp;
          }));
    }
  }

  // BORRAR REPUESTO

  borrarRepuesto( id: string, cellar: AutoCellar ) {

    let url = URL_SERVICES + '/repuesto/delete/' + id;
    url += '?token=' + this.userS.token;

    return this.http.put(url, cellar)
      .pipe(
        map( (resp: any) => {
          const partDB = resp.repuesto;
          swal('Repuesto borrado', partDB.desc, 'success');
          return resp;
        })
      );

  }
}
