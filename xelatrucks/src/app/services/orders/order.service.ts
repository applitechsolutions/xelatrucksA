import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { URL_SERVICES } from 'src/app/config/config';
import { UserService } from '../users/user.service';
import { Order } from '../../models/order.model';
import { Pull } from '../../models/pull.model';

import swal from 'sweetalert';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    public http: HttpClient,
    public userS: UserService
  ) { }

  crearOrden(order: Order) {

    let url = URL_SERVICES + '/order';
    url += '?token=' + this.userS.token;

    return this.http.post(url, order)
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
