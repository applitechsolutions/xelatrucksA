import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from 'src/app/config/config';
import { map, catchError } from 'rxjs/operators';
import { CPCustomer } from '../../models/CPcustomer.model';
import { throwError } from 'rxjs/internal/observable/throwError';

declare var swal: any;

@Injectable({
  providedIn: 'root'
})
export class CPcustomerService {

  constructor(
    public http: HttpClient,
    public userS: UserService
  ) { }

  cargarClientes() {
    const url = URL_SERVICES + '/CPcliente';
    return this.http.get(url);
  }

  cargarCliente( id: string ) {
    const url = URL_SERVICES + '/CPcliente/' + id;
    return this.http.get(url)
      .pipe(
        map( (resp: any) => {
          return resp.cliente;
        } )
      );
  }

  crearCliente( customer: CPCustomer ) {
    let url = URL_SERVICES + '/CPcliente';

    if (customer._id) {
      url += '/' + customer._id;
      url += '?token=' + this.userS.token;

      return this.http.put(url, customer)
      .pipe(
        map( (resp: any) => {
          const clienteDB = resp.cliente;
          swal({
            title: '¡Cliente Actualizado!',
            text: clienteDB.name,
            icon: 'success',
            button: false,
            timer: 1000
          });
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
          swal({
            title: '¡Cliente Creado!',
            text: clienteDB.name,
            icon: 'success',
            button: false,
            timer: 1000
          });
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

    let url = URL_SERVICES + '/CPcliente/delete/' + id;
    url += '?token=' + this.userS.token;

    return this.http.put(url, '')
      .pipe(
        map( (resp: any) => {
          const clienteDB = resp.cliente;
          swal({
            title: '¡Cliente borrado!',
            text: clienteDB.name,
            icon: 'success',
            button: false,
            timer: 1000
          });
          return resp;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message , 'error');
          return throwError( err );
        }));
  }
}
