import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../users/user.service';
import { URL_SERVICES } from 'src/app/config/config';
import { Vehicle } from '../../models/vehicle.model';
import { map } from 'rxjs/operators';
import swal from 'sweetalert';

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

  crearVehiculo( vehicle: Vehicle) {

    const url = URL_SERVICES + '/vehiculo?token=' + this.userS.token;

    return this.http.post(url, vehicle)
      .pipe( map( (resp: any) => {
        const vehicleDB = resp.vehiculo;
        swal('Vechiculo creado', 'Placa #' + vehicleDB.plate , 'success');
        return resp;
      }));

  }
}
