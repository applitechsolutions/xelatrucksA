import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatatablesService } from '../../services/service.index';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleService } from '../../services/vehicles/vehicle.service';
import { Make } from '../../models/make.model';
import { Basics } from '../../models/basics.model';

// declare function DataTable(): any;

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styles: []
})
export class VehiclesComponent implements OnInit {

  @ViewChild('closeP') closeP: ElementRef;

  // Listado principal
  vehicles: Vehicle[] = [];

  // Info principal
  icon: string = 'fas fa-info-circle';
  title: string = 'Información';
  type: string = '';
  info: string = 'Selecciona un vehículo para comenzar';
  selected: boolean = false;

  // Inicializacion del vehiculo
  vehicle: Vehicle = {
    no: 0,
    cp: '_',
    type: '',
    _make: { _id: '', name: '_'},
    plate: '_',
    model: 0,
    state: false,
    km: { $numberDecimal: 0.00 },
    mts: { $numberDecimal: 0.00 }
  };

  // Basics del vehiculo
  // listado
  basics: Basics[] = [];
  // Basic del form
  basic: Basics = {};

  constructor(
    public dtService: DatatablesService,
    public vehicleS: VehicleService
    ) { }

  ngOnInit() {
    // this.dtService.init_tables();
    this.vehicleS.cargarVehiculos()
    .subscribe( (resp: any) => {
        this.vehicles = resp.vehiculos;
    });
    console.log(this.vehicles);
  }

  seleccionarVehicle(vehicle: Vehicle) {
    this.vehicle = vehicle;
    console.log(this.vehicle);
    this.selected = true;
    if (vehicle.basics != null) {
      this.basics = vehicle.basics;
    } else {
      this.basics = [];
    }
    console.log(this.basic);
    switch (vehicle.type) {
      case 'camion':
        this.icon = 'fas fa-truck';
        this.type = 'Camión: ';
        this.title = this.vehicle.plate;
        this.info = '#' + this.vehicle.no + ' ' + this.vehicle._make.name + ' CP: ' + this.vehicle.cp;
        break;
        case 'camionG':
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

  addBasic() {
    this.basics.push({
      code: this.basic.code,
      name: this.basic.name,
      description: this.basic.description
    });
    this.basic = {};
    this.vehicleS.crearVehiculo( this.vehicle )
      .subscribe( resp => {
      console.log(this.vehicle);
      });
    this.closeP.nativeElement.click();
  }
}
