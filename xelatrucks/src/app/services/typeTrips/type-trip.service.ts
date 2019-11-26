import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Type } from '../../models/type.model';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class TypeTripService {

  constructor(
    public http: HttpClient,
    public userService: UserService
  ) { }

  cargarTypes() {

    const url = URL_SERVICES + '/tviajes';

    return this.http.get(url);
  }

  cargarType( id: string ) {
    const url = URL_SERVICES + '/tviajes/' + id;
    return this.http.get(url);
  }

  crearTypes(type: Type) {

    let url = URL_SERVICES + '/tviajes';

    if (type._id) {
      url += '?id=' + type._id;
      url += '&token=' + this.userService.token;
      return this.http.put(url, type)
        .pipe(
          map((res: any) => {
            const typeDB = res.tipo;
            swal('Tipo Actualizado', typeDB.name + typeDB.code , 'success');
            return res.tipo;
          }),
          catchError((err, caught) => {
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          })
        );
    } else {
      url += '?token=' + this.userService.token;
      return this.http.post(url, type)
        .pipe(
          map((res: any) => {
            return res;
          }),
          catchError((err, caught) => {
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          })
        );
    }

  }
}
