import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { GreenTrip } from 'src/app/models/greenTrip.model';
import swal from 'sweetalert';
import { WhiteTrip } from '../../models/whiteTrip.model';
import { TankTrip } from '../../models/tankTrip.model';

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

  cargarGreenReport(fecha1: Date, fecha2: Date) {

    let url = URL_SERVICES + '/viajeV/resume';
    url += '?fecha1=' + fecha1;
    url += '&fecha2=' + fecha2;

    return this.http.get(url);
  }

  borrarGreenTrip(trip: GreenTrip) {
    const url = `${URL_SERVICES}/viajeV/${trip._id}?token=${this.userService.token}`;
    return this.http.request('delete', url, { body: trip });
  }

  eliminarGreenTrip(trip: GreenTrip, km: number) {
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

  cargarWhiteTripsPurchaseCD() {
    const url = URL_SERVICES + '/viajeB/purchaseCD';
    return this.http.get(url);
  }

  cargarWhiteTrips(id: string) {
    const url = `${URL_SERVICES}/viajeB/${id}`;
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

  borrarWhiteTrip(trip: WhiteTrip, km: number) {
    const url = `${URL_SERVICES}/viajeB/${trip._id}?km=${km}&token=${this.userService.token}`;
    return this.http.request('delete', url, { body: trip });
  }

  eliminarWhiteTrip(trip: WhiteTrip, km: number) {
    const url = `${URL_SERVICES}/viajeB/anular?id=${trip._id}&km=${km}&token=${this.userService.token}`;

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

  /* #region  VIAJES CISTERNA */

  cargarTankTrips(fecha1: Date, fecha2: Date) {

    let url = URL_SERVICES + '/viajeA';
    url += '?fecha1=' + fecha1;
    url += '&fecha2=' + fecha2;

    return this.http.get(url);

  }

  cargarTankTrip(id: string) {

    let url = URL_SERVICES + '/viajeA/buscar';
    url += '?id=' + id;
    url += '&token=' + this.userService.token;

    return this.http.get(url);

  }

  eliminarTankTrip(tankTrip: TankTrip, km: number) {

    let url = URL_SERVICES + '/viajeA';
    url += '/delete?id=' + tankTrip._id;
    url += '&km=' + km;
    url += '&token=' + this.userService.token;

    return this.http.put(url, tankTrip)
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

  crearTankTrip(tankTrip: TankTrip, km: number) {

    let url = URL_SERVICES + '/viajeA';

    if (tankTrip._id) {
      url += '?id=' + tankTrip._id;
      url += '&km=' + km;
      url += '&token=' + this.userService.token;
      return this.http.put(url, tankTrip)
        .pipe(
          map((res: any) => {
            swal('Reporte cisterna Actualizado', 'consulte para continuar', 'success');
            return res.viajeV;
          }),
          catchError((err, caught) => {
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          })
        );
    } else {
      url += '?km=' + km;
      url += '&token=' + this.userService.token;
      return this.http.post(url, tankTrip)
        .pipe(
          map((res: any) => {
            swal('Reporte cisterna creado', 'consulte para continuar', 'success');
            return res.viajeA;
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
