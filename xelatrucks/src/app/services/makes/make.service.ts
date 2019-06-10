import { Injectable } from '@angular/core';
import { URL_SERVICES } from '../../config/config';
import { HttpClient } from '@angular/common/http';
import { Make } from '../../models/make.model';
import { UserService } from '../users/user.service';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';

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
      }));
  }
}
