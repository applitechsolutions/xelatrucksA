import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from 'src/app/config/config';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';
import { UserService } from '../users/user.service';
import { CashCD } from '../../models/cashCD.model';
import { CashTypeCD } from '../../models/cashTypeCD.model';

import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class CashServiceService {

  constructor(
    public http: HttpClient,
    public userS: UserService
  ) { }

  cargarSaldo() {
    const url = URL_SERVICES + '/cajaCD/lastBalance';

    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.saldo),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        })
      );
  }

  cargarMovimientos(fecha1: Date, fecha2: Date) {
    const url = URL_SERVICES + '/cajaCD?fecha1=' + fecha1 + '&fecha2=' + fecha2;

    return this.http.get(url)
      .pipe(map((resp: any) => resp.movimientos));
  }

  cargarPagos(fecha1: Date, fecha2: Date) {
    const url = URL_SERVICES + '/cajaCD/detailPays?fecha1=' + fecha1 + '&fecha2=' + fecha2;

    return this.http.get(url)
      .pipe(map((resp: any) => resp.pagos));
  }

  cargarMovimiento(id: string) {
    const url = URL_SERVICES + '/cajaCD/' + id;
    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.movimiento)
      );
  }

  borrarMovimiento(id: string) {
    let url = URL_SERVICES + '/cajaCD/delete/' + id;
    url += '?token=' + this.userS.token;

    return this.http.put(url, '')
      .pipe(
        map((resp: any) => {
          swal('Movimiento borrado', 'Si era en EFECTIVO por favor ingrese un EGRESO con el monto correspondiente', 'success');
          return resp;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        }));
  }

  crearMovimiento(cash: CashCD) {

    let url = URL_SERVICES + '/cajaCD';

    if (cash._id) {
      url += '/' + cash._id;
      url += '?token=' + this.userS.token;

      return this.http.put(url, cash)
        .pipe(
          map((resp: any) => {
            const cashDB = resp.movimiento;
            swal('Movimiento Actualizado', cashDB.name, 'success');
            return resp;
          }),
          catchError((err, caught) => {
            console.log(err);
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          }));

    } else {

      url += '?token=' + this.userS.token;

      return this.http.post(url, cash)
        .pipe(map((resp: any) => {
          return resp;
        }),
          catchError((err, caught) => {
            console.log(err);
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          }));
    }
  }

  /* #region  CashTypeCD */
  cargarTiposMovimiento() {
    const url = URL_SERVICES + '/cajaTiposCD';
    return this.http.get(url);
  }

  cargarTipoMovimiento(id: string) {
    const url = URL_SERVICES + '/cajaTiposCD/' + id;
    return this.http.get(url)
      .pipe(
        map((resp: any) => resp.movimiento)
      );
  }

  borrarTipoMovimiento(id: string) {
    let url = URL_SERVICES + '/cajaTiposCD/delete/' + id;
    url += '?token=' + this.userS.token;

    return this.http.put(url, '')
      .pipe(
        map((resp: any) => {
          const cashTypeDB = resp.movimiento;
          swal('Tipo de movimiento borrado', cashTypeDB.name, 'success');
          return resp;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        }));
  }

  crearTipoMovimiento(cashType: CashTypeCD) {

    let url = URL_SERVICES + '/cajaTiposCD';

    if (cashType._id) {
      url += '/' + cashType._id;
      url += '?token=' + this.userS.token;

      return this.http.put(url, cashType)
        .pipe(
          map((resp: any) => {
            const cashTypeDB = resp.movimiento;
            swal('Tipo de movimiento Actualizado', cashTypeDB.name, 'success');
            return resp;
          }),
          catchError((err, caught) => {
            console.log(err);
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          }));

    } else {

      url += '?token=' + this.userS.token;

      return this.http.post(url, cashType)
        .pipe(map((resp: any) => {
          const cashTypeDB = resp.movimiento;
          swal('Tipo de movimiento creado', cashTypeDB.name, 'success');
          return resp;
        }),
          catchError((err, caught) => {
            console.log(err);
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          }));
    }
  }
  /* #endregion */
}
