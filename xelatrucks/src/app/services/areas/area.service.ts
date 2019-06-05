import { Injectable } from '@angular/core';
import { Area } from '../../models/area.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { URL_SERVICES } from '../../config/config';

@Injectable({
  providedIn: 'root'
})
export class AreaService {

  area: Area;

  constructor(
    public http: HttpClient,
    public router: Router
  ) { }

  cargarAreas() {
    const url = URL_SERVICES + '/area';
    return this.http.get(url);
  }
}
