import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from '../../config/config';
import { Destination } from '../../models/destination.model';

import swal from 'sweetalert';
@Injectable({
  providedIn: 'root'
})
export class DestinationService {

  constructor(
    public http: HttpClient,
    public userS: UserService
  ) { }

  cargarDestinos() {
    const url = URL_SERVICES + '/destino';

    return this.http.get(url);
  }

  cargarDestino(id: string) {
    const url = URL_SERVICES + '/destino/' + id;

    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.destino)
      );
  }

  borrarDestino(id: string) {
    let url = URL_SERVICES + '/destino/delete/' + id;
    url += '?token=' + this.userS.token;

    return this.http.put(url, '')
      .pipe(
        map((resp: any) => {
          const destinoDB = resp.destino;
          swal('Destino borrado', destinoDB.name, 'success');
          return resp;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        }));

  }

  crearDestino(destination: Destination) {
    let url = URL_SERVICES + '/destino';

    if (destination._id) {
      url += '?id=' + destination._id;
      url += '&token=' + this.userS.token;

      return this.http.put(url, destination)
        .pipe(
          map((resp: any) => {
            console.log(resp);
            const destinoDB = resp.destino;
            swal('Destino Actualizado', destinoDB.name, 'success');
            return resp;
          }),
          catchError((err, caught) => {
            console.log(err);
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          }));
    } else {
      url += '?token=' + this.userS.token;
      return this.http.post(url, destination)
        .pipe(
          map((resp: any) => {
            const destinoDB = resp.destino;
            swal('Destino Creado', destinoDB.name, 'success');
            console.log(resp);
            return resp;
          }),
          catchError((err, caught) => {
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          })
        );
    }
  }
}
