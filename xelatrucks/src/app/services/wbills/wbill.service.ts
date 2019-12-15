import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from '../../config/config';
import { WhiteBill } from '../../models/whiteBill.model';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class WbillService {

  constructor(
    public http: HttpClient,
    public userService: UserService
  ) { }

  cargarPreDetalle( id: string, fecha1: Date, fecha2: Date ) {
    let url = URL_SERVICES + '/facturaB/detalles';
    url += '?id=' + id;
    url += '&fecha1=' + fecha1;
    url += '&fecha2=' + fecha2;

    return this.http.get(url);
  }

  cargarFacturas( fecha1: Date, fecha2: Date ) {
    let url = URL_SERVICES + '/facturaB';
    url += '?fecha1=' + fecha1;
    url += '&fecha2=' + fecha2;

    return this.http.get(url);
  }

  cargarFacturasNoPaid() {
    let url = URL_SERVICES + '/facturaB';
    url += '/nopaid';

    return this.http.get(url);
  }

  borrarFactura( whiteBill: WhiteBill ) {
    let url = URL_SERVICES + '/facturaB';
    url += '/delete?id=' + whiteBill._id;
    url += '&token=' + this.userService.token;

    return this.http.put(url, whiteBill);
  }

  crearFacturaBlanca( whiteBill: WhiteBill ) {
    let url = URL_SERVICES + '/facturaV';

    if (whiteBill._id) {
      url += '/' + whiteBill._id;
      url += '?token=' + this.userService.token;
      return this.http.put(url, whiteBill)
      .pipe(
        map((res: any) => {
          const gbDB = res.bill;
          swal('Factura creada correctamente!', 'success');
          return res.facturaV;
        }),
        catchError((err, caught) => {
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        })
      );
    } else {
      url += '?token=' + this.userService.token;
      return this.http.post(url, whiteBill)
        .pipe(
          map((res: any) => {
            const gbDB = res.facturaV;
            swal('Pre-factura creada correctamente!', 'success');
            return res.facturaV;
          }),
          catchError((err, caught) => {
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          })
        );
    }
  }
}
