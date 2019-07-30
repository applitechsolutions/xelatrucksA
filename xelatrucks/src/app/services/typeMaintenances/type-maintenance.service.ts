import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';
import { TypeMaintenance } from '../../models/typeMaintenance.model';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})
export class TypeMaintenanceService {

  constructor(
    public http: HttpClient,
    public userS: UserService
  ) { }

  cargarTipos() {
    const url = URL_SERVICES + '/tipoMantenimiento';
    return this.http.get(url);
  }

  cargarTipo( id: string ) {
    const url = URL_SERVICES + '/tipoMantenimiento/' + id;
    return this.http.get(url)
      .pipe(
        map( (resp: any) => resp.tipo )
      );
  }

  crearTipo( typeMaintenance: TypeMaintenance ) {

    let url = URL_SERVICES + '/tipoMantenimiento';

    if (typeMaintenance._id) {
      url += '/' + typeMaintenance._id;
      url += '?token=' + this.userS.token;

      return this.http.put(url, typeMaintenance )
        .pipe(
          map( (resp: any) => {
            const tipoDB = resp.tipo;
            swal('Tipo de mantenimiento Actualizado', tipoDB.name , 'success');
            return resp;
          }),
          catchError((err, caught) => {
            console.log(err);
            swal(err.error.mensaje, err.error.errors.message , 'error');
            return throwError( err );
          }));

    } else {

        url += '?token=' + this.userS.token;

        return this.http.post(url, typeMaintenance )
          .pipe( map( (resp: any) => {
            const tipoDB = resp.tipo;
            swal('Tipo de mantenimiento creado', tipoDB.name, 'success');
            return resp;
          }),
          catchError((err, caught) => {
            console.log(err);
            swal(err.error.mensaje, err.error.errors.message , 'error');
            return throwError( err );
          }));
    }
  }

  borrarTipo( id: string ) {

    let url = URL_SERVICES + '/tipoMantenimiento/delete/' + id;
    url += '?token=' + this.userS.token;

    return this.http.put(url, '')
      .pipe(
        map( (resp: any) => {
          const tipoDB = resp.tipo;
          swal('Tipo de mantenimiento borrado', tipoDB.name , 'success');
          return resp;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message , 'error');
          return throwError( err );
        })
      );

  }
}
