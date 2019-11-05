import { Injectable } from '@angular/core';
import { UserService } from '../users/user.service';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from 'src/app/config/config';
import { BuySpare } from '../../models/buySpare.model';
import swal from 'sweetalert';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})
export class BuySpareService {

  constructor(
    public http: HttpClient,
    public userS: UserService
  ) { }

  cargarCompras( fecha1: Date, fecha2: Date ) {
    const url = URL_SERVICES + '/compraRepuesto?fecha1=' + fecha1 + '&fecha2=' + fecha2;
    return this.http.get(url)
      .pipe( map( (resp: any) => resp.compras ));
  }

  crearCompra( buySpare: BuySpare ) {

    let url = URL_SERVICES + '/compraRepuesto';
    url += '?token=' + this.userS.token;

    return this.http.post(url, buySpare )
      .pipe( map( (resp: any) => {
        swal('Compra creada', 'Inventario de repuestos actualizado', 'success');
        return resp;
      }),
      catchError((err, caught) => {
        console.log(err);
        swal(err.error.mensaje, err.error.errors.message , 'error');
        return throwError( err );
      }));
  }
}
