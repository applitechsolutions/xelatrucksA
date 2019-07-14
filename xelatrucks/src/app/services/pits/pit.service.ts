import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from '../../config/config';
import { Pits } from '../../models/pits.model';
import swal from 'sweetalert';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})
export class PitService {

  constructor( public http: HttpClient, public userService: UserService ) { }

  cargarPits( id: string, isGondola: boolean ) {

    if (isGondola) {
      const url = URL_SERVICES + '/pit/gondola/' + id;
      return this.http.get(url);
    } else if (!isGondola) {
      const url = URL_SERVICES + '/pit/' + id;
      return this.http.get(url);
    }
  }

  crearPit( pit: Pits ) {

    const url = URL_SERVICES + '/pit?token=' + this.userService.token;

    return this.http.post(url, pit)
      .pipe(
        map( (res: any) => {
          return res.pit;
        }),
        catchError((err, caught) => {
          swal(err.error.mensaje, err.error.errors.message , 'error');
          return throwError( err );
        })
      );
  }
}
