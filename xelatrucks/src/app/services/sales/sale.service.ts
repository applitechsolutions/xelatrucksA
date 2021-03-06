import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Sale } from '../../models/sale.model';

import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(
    public http: HttpClient,
    public userService: UserService
  ) { }

  cargarVentas(fecha1: Date, fecha2: Date) {
    const url = `${URL_SERVICES}/ventas?fecha1=${fecha1}&fecha2=${fecha2}`;

    return this.http.get(url);
  }

  cargarCorrelativo() {
    const url = URL_SERVICES + '/ventas/lastCorrelative';

    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.venta),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        })
      );
  }

  crearVenta(sale: Sale) {
    const url = `${URL_SERVICES}/ventas?token=${this.userService.token}`;

    console.log(sale);
    return this.http.post(url, sale)
      .pipe(
        map((res: any) => {
          swal('Venta creada', 'Patios actualizados', 'success');
          return res;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.message, err.error.errors.message, 'error');
          return throwError(err);
        })
      );
  }

  anularVenta(sale: Sale) {
    const url = `${URL_SERVICES}/ventas/${sale._id}?token=${this.userService.token}`;
    return this.http.patch(url, sale)
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

  /* #region REPORTES */
  salesByAmount(startDate: Date, endDate: Date, startAmount: number, endAmount: number) {
    const url = `${URL_SERVICES}/ventas/amount?startDate=${startDate}&endDate=${endDate}&startAmount=${startAmount}&endAmount=${endAmount}`;

    return this.http.get(url);
  }

  salesBilled(fecha1: Date, fecha2: Date) {
    const url = `${URL_SERVICES}/ventas/bill?startDate=${fecha1}&endDate=${fecha2}`;

    return this.http.get(url);
  }

  salesNoBill(fecha1: Date, fecha2: Date) {
    const url = `${URL_SERVICES}/ventas/nobill?startDate=${fecha1}&endDate=${fecha2}`;

    return this.http.get(url);
  }

  canceledSales(fecha1: Date, fecha2: Date) {
    const url = `${URL_SERVICES}/ventas/cancel?startDate=${fecha1}&endDate=${fecha2}`;

    return this.http.get(url);
  }
  /* #endregion */
}
