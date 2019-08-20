import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';
import { Maintenance } from '../../models/maintenance.model';
import { throwError } from 'rxjs/internal/observable/throwError';

declare var swal: any;

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {

  constructor(
    public http: HttpClient,
    public userS: UserService
  ) { }

  cargarActiveV( id: string ) {
    const url = URL_SERVICES + '/mantenimiento/activeV/' + id;

    return this.http.get(url)
      .pipe( map( (resp: any) => {
        return resp;
      }));
  }

  cargarActiveG( id: string ) {
    const url = URL_SERVICES + '/mantenimiento/activeG/' + id;

    return this.http.get(url)
      .pipe( map( (resp: any) => {
        return resp;
      }));
  }

  finishMantenimiento( mantenimiento: Maintenance ) {

    let url = URL_SERVICES + '/mantenimiento';

    url += '/finish/' + mantenimiento._id + '?token=' + this.userS.token;
    // console.log('FINISH');
    return this.http.put(url, mantenimiento)
      .pipe( map( (resp: any) => {
        swal('Mantenimiento finalizado', 'Vehículo egresado del taller', 'success');
        return resp;
      }),
      catchError((err, caught) => {
        console.log(err);
        swal(err.error.mensaje, err.error.errors.message , 'error');
        return throwError( err );
      }));
  }

  cargarTerminados(fecha1: Date, fecha2: Date ) {
    const url = URL_SERVICES + '/mantenimiento/terminados?fecha1=' + fecha1 + '&fecha2=' + fecha2;

    return this.http.get(url);
  }

  crearMantenimiento( mantenimiento: Maintenance ) {

    let url = URL_SERVICES + '/mantenimiento';

    if (mantenimiento._id) {
      url += '/' + mantenimiento._id + '?token=' + this.userS.token;
      // console.log('EDIT');

      return this.http.put(url, mantenimiento)
        .pipe( map( (resp: any) => {
          swal({
            title: '¡Mantenimiento actualizado!',
            text: 'Cambios guardados correctamente',
            icon: 'success',
            button: false,
            timer: 1000
          });
          return resp;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message , 'error');
          return throwError( err );
        }));

    } else {
      url += '?token=' + this.userS.token;
      // console.log('SAVE');
      return this.http.post(url, mantenimiento)
        .pipe( map( (resp: any) => {
          swal('Mantenimiento creado', 'Vehículo ingresado al taller', 'success');
          return resp;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message , 'error');
          return throwError( err );
        }));
    }
  }
}
