import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from 'src/app/config/config';
import { Vehicle } from '../../models/vehicle.model';
import { Rim } from '../../models/rim.model';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Gas } from '../../models/gas.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(
    public http: HttpClient,
    public userS: UserService
  ) { }


  cargarVehiculos() {
    const url = URL_SERVICES + '/vehiculo';
    return this.http.get(url);
  }

  cargarRims() {
    const url = URL_SERVICES + '/llanta';
    return this.http.get(url);
  }

  guardarRim( rim: Rim ) {
    let url = URL_SERVICES + '/llanta';
    url += '?token=' + this.userS.token;

    return this.http.post(url, rim)
      .pipe(
        map( (res: any) => {
          const rimDB = res.llanta;
          return rimDB;
        })
      );
  }

  cargarVehiculo( id: string ) {
    const url = URL_SERVICES + '/vehiculo/' + id;

    return this.http.get(url)
      .pipe( map( (resp: any) =>  resp.vehiculo));
  }

  crearGasoline( gasoline: Gas, idVehicle: string ) {

    let url = URL_SERVICES + '/vehiculo/gasoline';

    if (gasoline._id) {
      url += '/' + idVehicle;
      url += '?token=' + this.userS.token;

      return this.http.put(url, gasoline )
        .pipe( map( (resp: any) => {
            const vehicleDB = resp.vehiculo;
            swal('Vechículo creado', 'Placa #' + vehicleDB.plate , 'success');
            return resp;
          }),
          catchError((err, caught) => {
            console.log(err);
            swal(err.error.mensaje, err.error.errors.message , 'error');
            return throwError( err );
          }));

    } else {
        url += '/' + idVehicle;
        url += '?token=' + this.userS.token;

        return this.http.post(url, gasoline)
          .pipe( map( (resp: any) => {
            const vehicleDB = resp.vehiculo;
            swal('Vechículo creado', 'Placa #' + vehicleDB.plate , 'success');
            return resp;
          }),
          catchError((err, caught) => {
            console.log(err);
            swal(err.error.mensaje, err.error.errors.message , 'error');
            return throwError( err );
          }));
    }
  }

  cargarGasolines( id: string, fecha1: Date, fecha2: Date ) {
    const url = URL_SERVICES + '/vehiculo/gasolines?id=' + id + '&fecha1=' + fecha1 + '&fecha2=' + fecha2;

    return this.http.get(url)
      .pipe( map( (resp: any) =>  resp.gasoline));
  }

  crearVehiculo( vehicle: Vehicle) {

    let url = URL_SERVICES + '/vehiculo';

    if (vehicle._id) {
      url += '/' + vehicle._id + '?token=' + this.userS.token;

      return this.http.put(url, vehicle)
        .pipe( map( (resp: any) => {
          const vehicleDB = resp.vehiculo;
          swal('Vechículo actualizado', 'Placa #' + vehicleDB.plate , 'success');
          return resp;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message , 'error');
          return throwError( err );
        }));

    } else {
      url += '?token=' + this.userS.token;

      return this.http.post(url, vehicle)
        .pipe( map( (resp: any) => {
          const vehicleDB = resp.vehiculo;
          swal('Vechículo creado', 'Placa #' + vehicleDB.plate , 'success');
          return resp;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message , 'error');
          return throwError( err );
        }));
    }
  }

  borrarVehiculo( id: string) {
    let url = URL_SERVICES + '/vehiculo/delete/' + id;
    url += '?token=' + this.userS.token;

    return this.http.put(url, '')
      .pipe(
        map( resp => {
          swal('Vehículo borrado', 'El usuario ha sido eliminado correctamente', 'success');
          return true;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message , 'error');
          return throwError( err );
        }));
  }
}
