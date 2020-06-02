import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { URL_SERVICES } from 'src/app/config/config';
import { UserService } from '../users/user.service';
import { Pull } from '../../models/pull.model';

declare var swal: any;

@Injectable({
  providedIn: 'root'
})
export class PullService {

  constructor(
    public http: HttpClient,
    public userS: UserService
  ) { }

  cargarActivas() {
    const url = URL_SERVICES + '/pull';
    return this.http.get(url);
  }

  cargarFinalizadas(fecha1: Date, fecha2: Date) {
    let url = URL_SERVICES + '/pull/finisheds';
    url += '?fecha1=' + fecha1;
    url += '&fecha2=' + fecha2;

    return this.http.get(url)
      .pipe(map((resp: any) => resp.pulls));
  }

  finalizarPull(pull: Pull) {

    let url = URL_SERVICES + '/pull/finish/' + pull._id + '/' + pull.details;
    url += '?token=' + this.userS.token;

    return this.http.put(url, '')
      .pipe(
        map((resp: any) => {
          swal({
            title: '¡Pull finalizado!',
            text: 'Puede consultarlo en el historial',
            icon: 'success',
            button: false,
            timer: 1000
          });
          return resp;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        }));
  }

  crearPull(pull: Pull) {
    let url = URL_SERVICES + '/pull';
    url += '?token=' + this.userS.token;

    return this.http.post(url, pull)
      .pipe(map((resp: any) => {
        return resp;
      }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        }));
  }
}
