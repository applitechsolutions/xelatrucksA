import { Injectable } from '@angular/core';
import { UserService } from '../users/user.service';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';
import { AutoProvider } from '../../models/autoProvider.model';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})
export class AutoProviderService {

  constructor(
    public http: HttpClient,
    public userS: UserService
  ) { }

  cargarProveedores() {
    const url = URL_SERVICES + '/autoProveedor';
    return this.http.get(url);
  }

  cargarProveedor( id: string ) {
    const url = URL_SERVICES + '/autoProveedor/' + id;
    return this.http.get(url)
      .pipe(
        map( (resp: any) => resp.proveedor )
      );
  }

  crearProveedor( autoProvider: AutoProvider ) {

    let url = URL_SERVICES + '/autoProveedor';

    if (autoProvider._id) {
      url += '/' + autoProvider._id;
      url += '?token=' + this.userS.token;

      return this.http.put(url, autoProvider )
        .pipe(
          map( (resp: any) => {
            const proveedorDB = resp.proveedor;
            swal('Proveedor Actualizado', proveedorDB.name , 'success');
            return resp;
          }),
          catchError((err, caught) => {
            console.log(err);
            swal(err.error.mensaje, err.error.errors.message , 'error');
            return throwError( err );
          }));

    } else {

        url += '?token=' + this.userS.token;

        return this.http.post(url, autoProvider )
          .pipe( map( (resp: any) => {
            const proveedorDB = resp.proveedor;
            swal('Proveedor creado', proveedorDB.name, 'success');
            return resp;
          }),
          catchError((err, caught) => {
            console.log(err);
            swal(err.error.mensaje, err.error.errors.message , 'error');
            return throwError( err );
          }));
    }
  }

  // BORRAR PROVEEDOR

  borrarProveedor( id: string ) {

    let url = URL_SERVICES + '/autoProveedor/delete/' + id;
    url += '?token=' + this.userS.token;

    return this.http.put(url, '')
      .pipe(
        map( (resp: any) => {
          const proveedorDB = resp.proveedor;
          swal('Proveedor borrado', proveedorDB.name , 'success');
          return resp;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message , 'error');
          return throwError( err );
        }));

  }
}
