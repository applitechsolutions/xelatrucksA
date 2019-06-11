import { Injectable } from '@angular/core';
import { Area } from '../../models/area.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { URL_SERVICES } from '../../config/config';
import { map, filter } from 'rxjs/operators';
import { UserArea } from '../../models/userArea.model';
import swal from 'sweetalert';
import { User } from '../../models/user.model';
import { UserService } from '../users/user.service';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  constructor(
    public http: HttpClient,
    public router: Router,
    public userS: UserService
  ) {

   }

  cargarAreas() {
    const url = URL_SERVICES + '/area';
    return this.http.get(url);
  }

  cargarUserAreas(user: string) {
    const url = URL_SERVICES + '/userarea/' + user;
    return this.http.get(url)
      .pipe(
        map( (resp: any) => {
          return resp.areas;
        }));
  }

  crearUserArea( areas: Area[], user: string ) {

    console.log(areas);

    const url = URL_SERVICES + '/userarea/' + user + '?token=' + this.userS.token;

    return this.http.post(url, areas)
      .pipe( map( (resp: any) => {
        swal('Cambios guardados', 'Áreas actualizadas correctamente', 'success');
        return resp;
      }));

  }
}
