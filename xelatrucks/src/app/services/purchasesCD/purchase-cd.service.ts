import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from 'src/app/config/config';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';
import { PurchaseCD } from '../../models/purchaseCD.model';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class PurchaseCDService {

  constructor(
    public http: HttpClient,
    public userS: UserService
  ) { }

  cargarCompras(fecha1: Date, fecha2: Date) {
    const url = URL_SERVICES + '/comprasCD?fecha1=' + fecha1 + '&fecha2=' + fecha2;

    return this.http.get(url)
      .pipe(map((resp: any) => resp.compras));
  }

  cargarPendientes() {
    const url = URL_SERVICES + '/comprasCD/tobePaid';

    return this.http.get(url)
      .pipe(map((resp: any) => resp.compras));
  }

  cargarAnuladas() {
    const url = URL_SERVICES + '/comprasCD/null';

    return this.http.get(url)
      .pipe(map((resp: any) => resp.compras));
  }

  pagarCompra(id: string) {

    let url = URL_SERVICES + '/comprasCD/pay/' + id;
    url += '?token=' + this.userS.token;

    return this.http.put(url, '')
      .pipe(
        map((resp: any) => {
          return resp;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        }));
  }

  borrarCompra(id: string) {
    let url = URL_SERVICES + '/comprasCD/delete/' + id;
    url += '?token=' + this.userS.token;

    return this.http.put(url, '')
      .pipe(
        map((resp: any) => {
          const purchaseDB = resp.compra;
          swal('Compra anulada', 'Q.' + purchaseDB.total, 'success');
          return resp;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        }));
  }

  crearCompra(purchase: PurchaseCD) {

    let url = URL_SERVICES + '/comprasCD';
    url += '?token=' + this.userS.token;

    return this.http.post(url, purchase)
      .pipe(map((resp: any) => {
        swal('Compra creada', 'Reportes actualizados', 'success');
        // console.log(resp);s
        return resp;
      }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        }));
  }
}
