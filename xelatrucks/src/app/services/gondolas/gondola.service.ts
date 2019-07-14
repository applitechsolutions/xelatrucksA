import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from 'src/app/config/config';
import { Gondola } from '../../models/gondola.model';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import swal from 'sweetalert';

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

  crearGondola( gondola: Gondola ) {

    let url = URL_SERVICES + '/gondola';

    if (gondola._id) {
      url += '/' + gondola._id + '?token=' + this.userS.token;

      return this.http.put(url, gondola)
        .pipe( map( (res: any) => {
          return res;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message , 'error');
          return throwError( err );
        }));

    } else {
      url += '?token=' + this.userS.token;

      return this.http.post(url, gondola)
        .pipe( map( (res: any) => {
          return res;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message , 'error');
          return throwError( err );
        }));
    }

  }

}

