import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from 'src/app/config/config';
import { MissingSurplus } from "../../models/missingsurplus.model";
import { UserService } from '../users/user.service';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class CdStorageService {

  constructor(
    public http: HttpClient,
    public userService: UserService
  ) { }

  cargarExcesos(type: boolean) {
    const url = `${URL_SERVICES}/excesos?type=${type}`;
    return this.http.get(url);
  }
}
