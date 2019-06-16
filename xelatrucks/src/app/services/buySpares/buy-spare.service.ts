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

  cargarCompras() {
    const url = URL_SERVICES + '/compraRepuesto';
    return this.http.get(url);
  }

  crearCompra( buySpare: BuySpare ) {

    let url = URL_SERVICES + '/autoProveedor';
    url += '?token=' + this.userS.token;

    return this.http.post(url, buySpare )
      .pipe( map( (resp: any) => {
        const compraDB = resp.compra;
        swal('Compra creada', 'Inventario de repuestos actualizado', 'success');
        return resp;
      }),
      catchError((err, caught) => {
        console.log(err);
        swal(err.error.mensaje, err.error.errors.message , 'error');
        return throwError( err );
      }));
  }

  // BORRAR PROVEEDOR

  // borrarProveedor( id: string, autoProvider: AutoProvider ) {

  //   let url = URL_SERVICES + '/autoProveedor/delete/' + id;
  //   url += '?token=' + this.userS.token;

  //   return this.http.put(url, autoProvider)
  //     .pipe(
  //       map( (resp: any) => {
  //         const proveedorDB = resp.proveedor;
  //         swal('Proveedor borrado', proveedorDB.name , 'success');
  //         return resp;
  //       })
  //     );

  // }
}
