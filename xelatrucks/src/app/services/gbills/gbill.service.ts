import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from '../../config/config';
import { GreenBill } from '../../models/gbill.model';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class GbillService {

  constructor(
    public http: HttpClient,
    public userService: UserService
  ) { }

  cargarPreDetalle( id: string, fecha1: Date, fecha2: Date ) {
    let url = URL_SERVICES + '/facturaV/detalles';
    url += '?id=' + id;
    url += '&fecha1=' + fecha1;
    url += '&fecha2=' + fecha2;

    return this.http.get(url);
  }

  cargarFacturas( fecha1: Date, fecha2: Date ) {
    let url = URL_SERVICES + '/facturaV';
    url += '?fecha1=' + fecha1;
    url += '&fecha2=' + fecha2;

    return this.http.get(url);
  }

  cargarPreFacturas() {
    let url = URL_SERVICES + '/facturaV';
    url += '/prebills';

    return this.http.get(url);
  }

  cargarCreditosFacturas() {
    let url = URL_SERVICES + '/facturaV';
    url += '/creditbills';

    return this.http.get(url);
  }

  borrarFactura( greenBill: GreenBill ) {
    let url = URL_SERVICES + '/facturaV';
    url += '/delete?id=' + greenBill._id;
    url += '&token=' + this.userService.token;

    return this.http.put(url, greenBill);
  }

  crearFacturaVerde( greenBill: GreenBill ) {
    let url = URL_SERVICES + '/facturaV';

    if (greenBill._id) {
      url += '/' + greenBill._id;
      url += '?token=' + this.userService.token;
      return this.http.put(url, greenBill)
      .pipe(
        map((res: any) => {
          const gbDB = res.bill;
          swal('Cambios aplicados correctamente!', 'success');
          return res.facturaV;
        }),
        catchError((err, caught) => {
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        })
      );
    } else {
      url += '?token=' + this.userService.token;
      return this.http.post(url, greenBill)
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
