import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import { Customer } from 'src/app/models/customer.model';
import swal from 'sweetalert';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    public http: HttpClient,
    public userS: UserService
  ) { }

  cargarClientes() {
    const url = URL_SERVICES + '/cliente';
    return this.http.get(url);
  }

  cargarCliente( id: string ) {
    const url = URL_SERVICES + '/cliente/' + id;
    return this.http.get(url)
      .pipe(
        map( (resp: any) => resp.cliente )
      );
  }

  crearCliente( customer: Customer ) {
    let url = URL_SERVICES + '/cliente';

    if (customer._id) {
      url += '/' + customer._id;
      url += '?token=' + this.userS.token;

      return this.http.put(url, customer)
      .pipe(
        map( (resp: any) => {
          const clienteDB = resp.cliente;
          swal('Cliente Actualizado', clienteDB.name, 'success');
          return resp;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message , 'error');
          return throwError( err );
        }));
    } else {
      url += '?token=' + this.userS.token;

      return this.http.post(url, customer)
        .pipe( map( (resp: any) => {
          const clienteDB = resp.cliente;
          swal('Cliente creado', clienteDB.name,'success');
          return resp;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message , 'error');
          return throwError( err );
        }));
    }
  }

  borrarCliente( id: string) {

    let url = URL_SERVICES + '/cliente/delete/' + id;
    url += '?token=' + this.userS.token;

    return this.http.put(url, '')
      .pipe(
        map( (resp: any) => {
          const clienteDB = resp.cliente;
          swal('CLiente borrado', clienteDB.name, 'success');
          return resp;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message , 'error');
          return throwError( err );
        }));
  }

}
