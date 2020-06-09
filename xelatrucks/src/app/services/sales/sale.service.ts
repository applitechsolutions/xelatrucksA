import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { Sale } from "../../models/sale.model";
import { URL_SERVICES } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

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

  crearVenta(sale: Sale) {
    let url = `${URL_SERVICES}/ventas?token=${this.userService.token}`;

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
      .subscribe();
  }
}
