import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Vehicle } from '../../models/vehicle.model';
import { Gondola } from '../../models/gondola.model';
import { GondolaService, VehicleService } from '../../services/service.index';

declare function init_step();

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styles: []
})
export class MaintenanceComponent implements OnInit, AfterViewInit {
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

  ngAfterViewInit(): void {
    init_step();
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

  /* #region   VEHICULOS*/
  cargarVehiculos() {
    this.vehicleS.cargarVehiculos()
      .subscribe((resp: any) => {
        this.vehicles = resp.vehiculos;
      });
  }

  seleccionarVehicle(vehicle: Vehicle) {
    this.cargarDisponibles();
    this.cargarRims();
    this.cargarHistorialPits(vehicle._id, false);
    this.vehicle = vehicle;
    this.selected = true;
    this.pits = vehicle.pits;
    this.basics = vehicle.basics;
    this.gasolines = [];
    this.calcularTotalesG();
    this.fecha1Consulta = '-';
    this.fecha2Consulta = '-';
    if (this.isTruckG && vehicle.type !== 'camionG' && this.inGondola) {
      this.detalles.nativeElement.click();
      this.inGondola = false;
    }
    this.isTruckG = false;
    this.isGondola = false;
    switch (vehicle.type) {
      case 'camion':
        this.icon = 'fas fa-truck';
        this.type = 'Camión: ';
        this.title = this.vehicle.plate;
        this.info = '#' + this.vehicle.no + ' ' + this.vehicle._make.name + ' CP: ' + this.vehicle.cp;
        break;
      case 'camionG':
        this.isTruckG = true;
        this.icon = 'fas fa-truck-moving';
        this.type = 'Camión gondola: ';
        this.title = this.vehicle.plate;
        this.info = '#' + this.vehicle.no + ' ' + this.vehicle._make.name + ' CP: ' + this.vehicle.cp;
        break;
      case 'vehiculo':
        this.icon = 'fas fa-truck-pickup';
        this.type = 'Vehículo: ';
        this.title = this.vehicle.plate;
        this.info = this.vehicle._make.name;
        break;
      case 'riego':
        this.icon = 'fas fa-truck-monster';
        this.type = 'Camión para riego: ';
        this.title = this.vehicle.plate;
        this.info = '#' + this.vehicle.no + ' ' + this.vehicle._make.name + ' CP: ' + this.vehicle.cp;
        break;
      case 'stock':
        this.icon = 'fas fa-snowplow';
        this.type = 'Excavadora: ';
        this.title = this.vehicle.plate;
        this.info = this.vehicle._make.name;
        break;
      default:
        this.icon = 'fas fa-info-circle';
        this.title = 'Información';
        this.info = 'Selecciona un vehículo para comenzar';
        break;
    }
  }
  /* #endregion */

}
