import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../service.index';
import { URL_SERVICES } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class GondolaService {

  constructor(
    public http: HttpClient,
    public userS: UserService
  ) { }
  cargarGondolas() {
    const url = URL_SERVICES + '/gondola';
    return this.http.get(url);
  }
}

