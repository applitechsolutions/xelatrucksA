import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from '../../config/config';
import { Material } from '../../models/material.model';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

  constructor(
    public http: HttpClient,
    public userService: UserService
  ) { }

  cargarMateriales() {
    const url = URL_SERVICES + '/material';

    return this.http.get(url);
  }

  crearMaterial( material: Material ) {
    let url = URL_SERVICES + '/material';

    if (material._id) {
      return;
    } else {
      url += '?token=' + this.userService.token;

      return this.http.post(url, material)
      .pipe(
        map( (res: any) => {
          return res;
        }),
        catchError((err, caught) => {
          swal(err.error.mensaje, err.error.errors.message , 'error');
          return throwError( err );
        })
      );
    }
  }


}
