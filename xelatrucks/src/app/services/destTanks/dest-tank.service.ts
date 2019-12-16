import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { DestTank } from '../../models/destTank.model';
import { UserService } from '../users/user.service';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class DestTankService {

  constructor(
    public userService: UserService,
    public http: HttpClient
  ) { }

  cargarDestinos() {
    const url = URL_SERVICES + '/destinoA';

    return this.http.get(url);
  }

  cargarDestino( id: string ) {
    let url = URL_SERVICES + '/destinoA/destino';
    url += '?id=' + id;

    return this.http.get(url);
  }

  borrarDestino( destTank: DestTank ) {
    let url = URL_SERVICES + '/destinoA';
    url += '/delete?id=' + destTank._id;
    url += '&token=' + this.userService.token;
    
    return this.http.put(url, destTank)
      .pipe(
        map( (res: any) => {
          const destDB = res.destino;
          swal('Destino borrado', destDB.name, 'success');
          return res;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message , 'error');
          return throwError( err );
        })
      );
  }

  crearDestino( destTank: DestTank ) {

    let url = URL_SERVICES + '/destinoA';

    if (destTank._id) {
      url += '?id=' + destTank._id;
      url += '&token=' + this.userService.token;

      return this.http.put(url, destTank)
        .pipe(
          map((resp: any) => {
            const destinoDB = resp.destino;
            swal('Destino Actualizado', destinoDB.name, 'success');
            return resp;
          }),
          catchError((err, caught) => {
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          }));
    } else {
      url += '?token=' + this.userService.token;
      return this.http.post(url, destTank)
        .pipe(
          map((resp: any) => {
            const destinoDB = resp.destino;
            swal('Destino Creado', destinoDB.name, 'success');
            return resp;
          }),
          catchError((err, caught) => {
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          }));
    }
    
  }
}
