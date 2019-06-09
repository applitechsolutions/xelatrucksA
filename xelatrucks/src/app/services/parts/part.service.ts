import { Injectable } from '@angular/core';
import { URL_SERVICES } from '../../config/config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PartService {

  constructor(public http: HttpClient) { }


  cargarRepuestos() {

    const url = URL_SERVICES + '/repuesto';
    return this.http.get(url);
  }
}
