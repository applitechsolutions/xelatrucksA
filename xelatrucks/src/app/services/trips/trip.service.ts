import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from '../../config/config';
import { Type } from '../../models/type.model';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import swal from 'sweetalert';
import { GreenTrip } from 'src/app/models/greenTrip.model';


@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(
    public http: HttpClient,
    public userService: UserService
  ) { }

  crearGreenTrip( greenTrip: GreenTrip ) {
    let url = URL_SERVICES + '/viajeV';

    if (greenTrip._id) {
      return;
    } else {
      url += '?token=' + this.userService.token;
      return this.http.post(url, greenTrip)
      .pipe(
        map( (res: any) => {
          return res;
        }),
        catchError((err, caught) => {
          swal(err.error.mensaje, err.error.errors.message , 'error');
          return throwError( err );
        })
      );
    }

  }

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
            return res;
          }),
          catchError((err, caught) => {
            swal(err.error.mensaje, err.error.errors.message , 'error');
            return throwError( err );
          })
        );
    }

  }

}
