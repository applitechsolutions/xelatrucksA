import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from '../../config/config';
import { Material } from '../../models/material.model';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

declare var swal: any;
@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  constructor(
    public http: HttpClient,
    public userS: UserService
  ) { }

  cargarMateriales() {
    const url = URL_SERVICES + '/material';
    return this.http.get(url);
  }

  cargarCatalogo() {
    const url = URL_SERVICES + '/material/catalog';
    return this.http.get(url);
  }

  cargarInventario() {
    const url = URL_SERVICES + '/material/storage';
    return this.http.get(url);
  }

  // ACTUALIZAR STOCK PURCHASE
  stockPurchase(storage: any) {
    let url = URL_SERVICES + '/material/purchase/';
    url += '?token=' + this.userS.token;
    return this.http.put(url, storage)
      .pipe(
        map((resp: any) => {
          return resp;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        })
      );
  }

  crearMaterial(material: Material) {
    let url = URL_SERVICES + '/material';

    if (material._id) {
      url += '/' + material._id;
      url += '?token=' + this.userS.token;

      return this.http.put(url, material)
        .pipe(
          map((resp: any) => {
            const materialDB = resp.material;
            swal({
              title: 'Material Actualizado!',
              text: materialDB.name,
              icon: 'success',
              button: false,
              timer: 1000
            });
            return resp;
          }),
          catchError((err, caught) => {
            console.log(err);
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          }));
    } else {
      url += '?token=' + this.userS.token;

      return this.http.post(url, material)
        .pipe(
          map((res: any) => {
            return res;
          }),
          catchError((err, caught) => {
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError(err);
          })
        );
    }
  }

  borrarMaterial(id: string) {

    let url = URL_SERVICES + '/material/delete/' + id;
    url += '?token=' + this.userS.token;

    return this.http.put(url, '')
      .pipe(
        map((resp: any) => {
          const materialDB = resp.material;
          swal({
            title: '¡Material borrado!',
            text: materialDB.name,
            icon: 'success',
            button: false,
            timer: 1000
          });
          return resp;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        }));
  }
}
