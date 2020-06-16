import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from 'src/app/config/config';
import { MissingSurplus } from '../../models/missingsurplus.model';
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

  crearExceso(missingsurplus: MissingSurplus, isAdmin: boolean) {
    const url = isAdmin ? `${URL_SERVICES}/excesos/admin?token=${this.userService.token}` : `${URL_SERVICES}/excesos/noadmin?token=${this.userService.token}`;

    console.log(url);
    const name = missingsurplus.type ? 'Faltante' : 'Sobrante';

    return this.http.post(url, missingsurplus)
      .pipe(
        map((res: any) => {
          swal(`${name} creado correctamente`, 'Patios actualizados', 'success');
          return res;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.message, err.error.errors.message, 'error');
          return throwError(err);
        })
      );
  }

  finalizarExceso(missingsurplus: MissingSurplus, isGood: boolean) {
    const url = isGood ? `${URL_SERVICES}/excesos/confirmar?token=${this.userService.token}` : `${URL_SERVICES}/excesos/rechazar?token=${this.userService.token}`;

    return this.http.patch(url, missingsurplus)
      .pipe(
        map((res: any) => {
          return res;
        }),
        catchError((err, caught) => {
          swal(err.error.mensaje, err.error.errors.message, 'error');
          return throwError(err);
        })
      );
  }
}
