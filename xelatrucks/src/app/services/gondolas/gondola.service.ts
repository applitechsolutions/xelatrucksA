import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from 'src/app/config/config';
import { Gondola } from '../../models/gondola.model';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

declare var swal: any;

@Injectable({
  providedIn: 'root'
})
export class GondolaService {

  constructor(
    public http: HttpClient,
    public userS: UserService
  ) { }

  cargarGondolas() {
    const url = URL_SERVICES + '/gondola';
    return this.http.get(url);
  }

  cargarDisponibles() {
    const url = URL_SERVICES + '/gondola/availables';
    return this.http.get(url);
  }

  crearGondola(gondola: Gondola) {

    let url = URL_SERVICES + '/gondola';

    if (gondola._id) {
      url += '/' + gondola._id + '?token=' + this.userS.token;

      return this.http.put(url, gondola)
        .pipe(map((res: any) => {
          const gondolaDB = res.gondola;
          swal({
            title: 'Exito!',
            text: 'Góndola actualizada correctamente' + gondolaDB.plate,
            icon: 'success',
            button: false,
            timer: 1000
          });
          return res;
        }),
          catchError((err, caught) => {
            console.log(err);
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          }));
    } else {
      url += '?token=' + this.userS.token;

      return this.http.post(url, gondola)
        .pipe(map((res: any) => {
          const gondolaDB = res.gondola;
          swal({
            title: 'Exito!',
            text: 'Góndola creada correctamente' + gondolaDB.plate,
            icon: 'success',
            button: false,
            timer: 1000
          });
          return res;
        }),
          catchError((err, caught) => {
            console.log(err);
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          }));
    }

  }

  borrarGondola(gondola: Gondola) {
    let url = URL_SERVICES + '/gondola/delete/' + gondola._id;
    url += '?token=' + this.userS.token;

    return this.http.put(url, gondola)
      .pipe(map((res: any) => {
        const gondolaDB = res.gondola;
        swal({
          title: 'Exito!',
          text: 'Góndola eliminada correctamente' + gondolaDB.plate,
          icon: 'success',
          button: false,
          timer: 1000
        });
        return res;
      }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        }));
  }

  asignarGondola(gondola: Gondola) {

    let url = URL_SERVICES + '/gondola/';

    // console.log( gondola );

    if (gondola._truck._id !== null) {
      url += 'asignar/' + gondola._id;
      url += '?token=' + this.userS.token;

      return this.http.put(url, gondola)
        .pipe(map((res: any) => {
          const gondolaDB = res.gondola;
          swal({
            title: 'Exito!',
            text: 'Góndola asignada correctamente' + gondolaDB.plate,
            icon: 'success',
            button: false,
            timer: 1000
          });
          return res;
        }),
          catchError((err, caught) => {
            console.log(err);
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          }));

    } else {

      url += 'desasignar/' + gondola._id;
      url += '?token=' + this.userS.token;

      return this.http.put(url, gondola)
        .pipe(map((res: any) => {
          const gondolaDB = res.gondola;
          swal({
            title: 'Exito!',
            text: 'Góndola desasignada correctamente' + gondolaDB.plate,
            icon: 'success',
            button: false,
            timer: 1000
          });
          return res;
        }),
          catchError((err, caught) => {
            console.log(err);
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          }));

    }

  }

}

