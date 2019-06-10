import { Injectable } from '@angular/core';
import { URL_SERVICES } from '../../config/config';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MakeService {

  constructor(public http: HttpClient) { }

  cargarMarcas() {
    const url = URL_SERVICES + '/marca';
    return this.http.get(url);
  }
}
