import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from 'src/app/config/config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MaintenanceService {

  constructor(
    public http: HttpClient,
    public userS: UserService
  ) { }

  cargarActiveV( id: string ) {
    const url = URL_SERVICES + '/mantenimiento/activeV/' + id;

    return this.http.get(url)
      .pipe( map( (resp: any) =>  resp.mantenimiento));
  }

  cargarActiveG( id: string ) {
    const url = URL_SERVICES + '/mantenimiento/activeG/' + id;

    return this.http.get(url)
      .pipe( map( (resp: any) =>  resp.mantenimiento));
  }
}
