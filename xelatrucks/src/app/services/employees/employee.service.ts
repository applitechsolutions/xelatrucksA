import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { Employee } from '../../models/employee.model';
import { URL_SERVICES } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(public http: HttpClient, public userService: UserService) { }

  cargarEmpleados() {
    const url = URL_SERVICES + '/empleado';

    return this.http.get(url);
  }

  cargarEmpleado( id: string ) {
    let url = URL_SERVICES + '/empleado/' + id;
    url += '?token=' + this.userService.token;

    return this.http.get(url);
  }

  crearEmpleado( empleado: Employee ) {

    let url = URL_SERVICES + '/empleado';

    if (empleado._id) {
      url += '/' + empleado._id;
      url += '?token=' + this.userService.token;
      return this.http.put(url, empleado)
        .pipe(
          map( (res: any) => {
            const emplDB = res.empleado;
            swal('Empleado Actualizado', emplDB.name, 'success');
            return res.empleado;
          }),
          catchError((err, caught) => {
            swal(err.error.mensaje, err.error.errors.message, 'error');
            return throwError( err );
          })
        );
    } else {
      url += '?token=' + this.userService.token;
      return this.http.post(url, empleado)
        .pipe(
          map( (res: any) => {
            const emplDB = res.empleado;
            swal('Empleado Creado', emplDB.name, 'success');
            return res.mecanico;
          }),
          catchError((err, caught) => {
            swal(err.error.mensaje, err.error.errors.message , 'error');
            return throwError( err );
          })
        );
    }

  }

  borrarEmpleado( empleado: Employee ) {

    let url = URL_SERVICES + '/empleado/delete';
    url += '/' + empleado._id;
    url += '?token=' + this.userService.token;

    return this.http.put(url, empleado)
      .pipe(
        map( (res: any) => {
          const empDB = res.empleado;
          swal('Empleado borrado', empDB.name, 'success');
          return res;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message , 'error');
          return throwError( err );
        })
      );
  }

}
