import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from '../../config/config';
import { Type } from '../../models/type.model';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import swal from 'sweetalert';


@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(
    public http: HttpClient,
    public userService: UserService
  ) { }

  cargarTypes() {

    const url = URL_SERVICES + '/tviajes';

    return this.http.get(url);

  }

  crearTypes( type: Type ) {

    let url = URL_SERVICES + '/tviajes';

    if (type._id) {
      return;
    } else {
      url += '?token=' + this.userService.token;
      return this.http.post(url, type)
        .pipe(
          map( (res: any) => {
            const typeDB = res.viaje;
            swal('Empleado Creado', typeDB.name, 'success');
            return res.viajes;
          }),
          catchError((err, caught) => {
            swal(err.error.mensaje, err.error.errors.message , 'error');
            return throwError( err );
          })
        );
    }

  }

}
