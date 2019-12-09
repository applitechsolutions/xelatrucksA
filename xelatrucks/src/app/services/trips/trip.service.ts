import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { GreenTrip } from 'src/app/models/greenTrip.model';
import swal from 'sweetalert';
import { WhiteTrip } from '../../models/whiteTrip.model';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  constructor(
    public http: HttpClient,
    public userService: UserService
  ) { }

  /* #region  VIAJES VERDES */

  crearGreenTrip(greenTrip: GreenTrip, diferencia: number) {
    let url = URL_SERVICES + '/viajeV';

    if (greenTrip._id) {
      url += '?id=' + greenTrip._id;
      url += '&diferencia=' + diferencia;
      url += '&token=' + this.userService.token;
      return this.http.put(url, greenTrip)
        .pipe(
          map((res: any) => {
            swal('Reporte cuadros Actualizado', 'consulte para continuar', 'success');
            return res.viajeV;
          }),
          catchError((err, caught) => {
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          })
        );
    } else {
      url += '?token=' + this.userService.token;
      return this.http.post(url, greenTrip)
        .pipe(
          map((res: any) => {
            swal('Reporte cuadros creado', 'consulte para continuar', 'success');
            return res.viajeV;
          }),
          catchError((err, caught) => {
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          })
        );
    }

  }

  cargarGreenTrip(id: string) {
    let url = URL_SERVICES + '/viajeV';
    url += '/' + id;
    url += '?token=' + this.userService.token;

    return this.http.get(url);
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

  eliminarGreenTrip( trip: GreenTrip, km: number ) {
    let url = URL_SERVICES + '/viajeV';
    url += '/borrar?id=' + trip._id;
    url += '&km=' + km;
    url += '&token=' + this.userService.token;

    return this.http.put(url, trip)
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

  /* #endregion */

  /* #region  VIAJES BLANCOS */

  cargarWhiteTrips(id: string) {
    let url = URL_SERVICES + '/viajeB';
    url += '/' + id;

    return this.http.get(url);
  }

  crearWhiteTrip(whiteTrip: WhiteTrip, km: number) {
    let url = URL_SERVICES + '/viajeB';

    if (whiteTrip._id) {
      return;
    } else {
      url += '?km=' + km;
      url += '&token=' + this.userService.token;
      return this.http.post(url, whiteTrip)
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
