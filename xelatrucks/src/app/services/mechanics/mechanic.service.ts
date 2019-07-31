import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from '../../config/config';
import { Mechanic } from '../../models/mech.model';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import swal from 'sweetalert';


@Injectable({
  providedIn: 'root'
})
export class MechanicService {

  constructor(public http: HttpClient, public userService: UserService) { }

  cargarMecanicos() {
    const url = URL_SERVICES + '/mecanico';

    return this.http.get(url);
  }

  cargarMecanico( id: string ) {
    let url = URL_SERVICES + '/mecanico/' + id;
    url += '/?token=' + this.userService.token;

    return this.http.get(url)
      .pipe(
        map( (res: any) => res.mecanico ),
        catchError((err, caught) => {
          swal(err.error.mensaje, err.error.errors.message , 'error');
          return throwError( err );
        })
      );
  }

  crearMecanico( mech: Mechanic ) {

    let url = URL_SERVICES + '/mecanico';

    if (mech._id) {
      url += '/' + mech._id;
      url += '?token=' + this.userService.token;
      return this.http.put(url, mech)
        .pipe(
          map( (res: any) => {
            const mechDB = res.mecanico;
            swal('Mecánico Actualizado', mechDB.name, 'success');
            return res.mecanico;
          }),
          catchError((err, caught) => {
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError( err );
          })
        );
    } else {

      url += '?token=' + this.userService.token;
      return this.http.post(url, mech)
        .pipe(
          map( (res: any) => {
            const mechDB = res.mecanico;
            swal('Mecánico Creado', mechDB.name, 'success');
            return res.mecanico;
          }),
          catchError((err, caught) => {
            swal(err.error.mensaje, err.error.errors.message , 'error');
            return throwError( err );
          })
        );
    }

  }

  borrarMecanico( mech: Mechanic ) {

    let url = URL_SERVICES + '/mecanico/delete';
    url += '/' + mech._id;
    url += '?token=' + this.userService.token;

    return this.http.put(url, mech)
      .pipe(
        map( (res: any) => {
          const mechDB = res.mecanico;
          swal('Mecanico borrado', mechDB.name, 'success');
          return res;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message , 'error');
          return throwError( err );
        })
      );
  }
}
