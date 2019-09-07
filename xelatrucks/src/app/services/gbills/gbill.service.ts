import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class GbillService {

  constructor(
    public http: HttpClient,
    public userService: UserService
  ) { }

  cargarPreDetalle( fecha1: Date, fecha2: Date ) {
    let url = URL_SERVICES + '/facturaV/detalles';
    url += '?fecha1=' + fecha1;
    url += '&fecha2=' + fecha2;

    return this.http.get(url);
  }
}
