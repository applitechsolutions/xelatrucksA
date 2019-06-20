import { Injectable } from '@angular/core';
import { URL_SERVICES } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { Make } from '../../models/make.model';
import { UserService } from '../users/user.service';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})
export class MakeService {

  constructor(
    public http: HttpClient,
    public userS: UserService
    ) { }

  cargarMarcas() {
    const url = URL_SERVICES + '/marca';
    return this.http.get(url);
  }

  crearMarca(make: Make) {
    const url = URL_SERVICES + '/marca?token=' + this.userS.token;

    return this.http.post(url, make)
      .pipe( map( (resp: any) => { 
          const makeDB = resp.marca;
          swal('Marca creada', makeDB.name , 'success');
          return resp;
      }),
      catchError((err, caught) => {
        console.log(err);
        swal(err.error.mensaje, err.error.errors.message , 'error');
        return throwError( err );
      }));
  }
}
