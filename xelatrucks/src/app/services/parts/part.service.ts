import { Injectable } from '@angular/core';
import { URL_SERVICES } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { Part } from '../../models/part.model';
import { map, catchError } from 'rxjs/operators';
import { UserService } from '../users/user.service';
import { AutoCellar } from '../../models/autoCellar';
import { throwError } from 'rxjs/internal/observable/throwError';
import { DetailsSpare } from '../../models/detailsSpare.model';

declare var swal: any;

@Injectable({
  providedIn: 'root'
})
export class PartService {

  constructor(
    public http: HttpClient,
    public userS: UserService
    ) {}

  cargarRepuestos() {

    const url = URL_SERVICES + '/repuesto';
    return this.http.get(url);
  }

  cargarRepuesto( id: string ) {
    const url = URL_SERVICES + '/repuesto/' + id;
    return this.http.get(url)
      .pipe(
        map( (resp: any) => resp.repuesto ),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message , 'error');
          return throwError( err );
        })
      );
  }

      // ACTUALIZAR STOCK PURCHASE

      stockPurchase( storage: DetailsSpare ) {

        let url = URL_SERVICES + '/repuesto/purchase/';
        url += '?token=' + this.userS.token;

        return this.http.put(url, storage)
          .pipe(
            map( (resp: any) => {
              return resp;
            }),
            catchError((err, caught) => {
              console.log(err);
              swal(err.error.mensaje, err.error.errors.message , 'error');
              return throwError( err );
            })
          );
      }

    // ACTUALIZAR STOCK SALE

    stockSale( storage: DetailsSpare ) {

      let url = URL_SERVICES + '/repuesto/sale/';
      url += '?token=' + this.userS.token;

      return this.http.put(url, storage)
        .pipe(
          map( (resp: any) => {
            return resp;
          }),
          catchError((err, caught) => {
            console.log(err);
            swal(err.error.mensaje, err.error.errors.message , 'error');
            return throwError( err );
          })
        );
    }

  crearRepuesto( part: Part ) {

    let url = URL_SERVICES + '/repuesto';

    if (part._id) {
      url += '/' + part._id;
      url += '?token=' + this.userS.token;

      return this.http.put(url, part )
        .pipe(
          map( (resp: any) => {
            const partDB = resp.repuesto;
            swal('Repuesto Actualizado', partDB.desc, 'success');
            return resp;
          }),
          catchError((err, caught) => {
            console.log(err);
            swal(err.error.mensaje, err.error.errors.message , 'error');
            return throwError( err );
          }));

    } else {

        url += '?token=' + this.userS.token;

        return this.http.post(url, part)
          .pipe( map( (resp: any) => {
            const partDB = resp.repuesto;
            swal({
              title: '¡Repuesto creado!',
              text: partDB.desc,
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

  // BORRAR REPUESTO

  borrarRepuesto( id: string, cellar: AutoCellar ) {

    let url = URL_SERVICES + '/repuesto/delete/' + id;
    url += '?token=' + this.userS.token;

    return this.http.put(url, cellar)
      .pipe(
        map( (resp: any) => {
          const partDB = resp.repuesto;
          swal('Repuesto borrado', partDB.desc, 'success');
          return resp;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message , 'error');
          return throwError( err );
        })
      );

  }
}
