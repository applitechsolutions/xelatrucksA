import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../service.index';
import { URL_SERVICES } from '../../config/config';
import { TankBill } from 'src/app/models/tankBill.model';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class TbillService {

  constructor(
    public http: HttpClient,
    public userService: UserService
  ) { }

  cargarPreDetalle( id: String, fecha1: Date, fecha2: Date ) {
    let url = URL_SERVICES + '/facturaA/detalles';
    url += '?idD=' + id;
    url += '&fecha1=' + fecha1;
    url += '&fecha2=' + fecha2;

    return this.http.get(url);
  }

  cargarFacturas(fecha1: Date, fecha2: Date) {
    let url = URL_SERVICES + '/facturaA';
    url += '/paid';
    url += '?fecha1=' + fecha1;
    url += '&fecha2=' + fecha2;

    return this.http.get(url);
  }

  cargarFacturasNoPaid() {
    const url = URL_SERVICES + '/facturaA';

    return this.http.get(url);
  }

  borrarFactura( tankBill: TankBill ) {
    let url = URL_SERVICES + '/facturaA';
    url += '/delete?id=' + tankBill._id;
    url += '&token=' + this.userService.token;

    return this.http.put(url, tankBill);
  }

  crearFacturaCisterna( tanknBill: TankBill ) {
    let url = URL_SERVICES + '/facturaA';

    if (tanknBill._id) {
      url += '/' + tanknBill._id;
      url += '?token=' + this.userService.token;
      return this.http.put(url, tanknBill)
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
      return this.http.post(url, tanknBill)
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
