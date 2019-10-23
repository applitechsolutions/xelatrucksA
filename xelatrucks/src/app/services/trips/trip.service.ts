import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { GreenTrip } from 'src/app/models/greenTrip.model';
import { Type } from '../../models/type.model';
import swal from 'sweetalert';


@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(
    public http: HttpClient,
    public userService: UserService
  ) { }

  crearGreenTrip(greenTrip: GreenTrip) {
    let url = URL_SERVICES + '/viajeV';

    if (greenTrip._id) {
      return;
    } else {
      url += '?token=' + this.userService.token;
      return this.http.post(url, greenTrip)
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

  cargarGreenTrips(fecha1: Date, fecha2: Date) {

    let url = URL_SERVICES + '/viajeV/reports';
    url += '?fecha1=' + fecha1;
    url += '&fecha2=' + fecha2;

    return this.http.get(url);
  }

  borrarGreenTrip(trip: GreenTrip) {
    let url = URL_SERVICES + '/viajeV';
    url += '/' + trip._id;
    url += '?token=' + this.userService.token;

    return this.http.request('delete', url, { body: trip });
  }

  /* #region  TIPOS DE VIAJES */

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
      return;
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

  /* #endregion */

}
