import { Component, OnInit } from '@angular/core';
import { Vehicle } from 'src/app/models/vehicle.model';
import { Gondola } from 'src/app/models/gondola.model';
import { GondolaService, VehicleService } from 'src/app/services/service.index';

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styles: []
})
export class MaintenanceComponent implements OnInit {
  public loading = false;

  // Listado principal
  vehicles: Vehicle[] = [];
  gondolas: Gondola[] = [];

  // Info principal
  icon: string = 'fas fa-info-circle';
  title: string = 'Información';
  type: string = '';
  info: string = 'Selecciona un vehículo para comenzar';
  selected: boolean = false;
  isTruckG: boolean = false;
  isGondola: boolean = false;

  // Inicializacion del vehiculo
  vehicle: Vehicle = {
    no: 0,
    cp: '_',
    type: '',
    _make: { _id: '', name: '_' },
    plate: '_',
    model: 0,
    state: false,
    km: 0.00,
    mts: 0.00
  };

  // Objeto de Gondola
  gondola: Gondola = { plate: '' };

  constructor(
    public gondolaS: GondolaService,
    public vehicleS: VehicleService
  ) { }

  ngOnInit() {
    this.cargarVehiculos();
    this.cargarGondolas();
  }

  /* #region  GONDOLAS */
  cargarGondolas() {
    this.gondolaS.cargarGondolas()
      .subscribe((resp: any) => {
        this.gondolas = resp.gondolas;
      });
  }

  seleccionarGondola(gondola: Gondola) {
    this.gondola = gondola;
    this.selected = true;
    this.isGondola = true;
    this.isTruckG = false;
    this.icon = 'fas fa-truck-moving';
    this.type = 'Gondola: ';
    this.title = this.gondola.plate;
    this.info = 'Gondola Seleccionada';
  }
  /* #endregion */

  /* #region   */
  cargarVehiculos() {
    this.vehicleS.cargarVehiculos()
      .subscribe((resp: any) => {
        this.vehicles = resp.vehiculos;
      });
  }
  /* #endregion */

}
