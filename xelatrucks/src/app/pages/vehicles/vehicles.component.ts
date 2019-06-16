import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DatatablesService } from '../../services/service.index';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleService } from '../../services/vehicles/vehicle.service';
import { Basics } from '../../models/basics.model';
import { Pits } from '../../models/pits.model';

declare var swal: any;
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

  pits: Pits[] = [];
  pit: Pits = {};

  constructor(
    public dtService: DatatablesService,
    public vehicleS: VehicleService
    ) { }

  ngOnInit() {
    // this.dtService.init_tables();
    this.cargarVehiculos();
  }

  cargarVehiculos() {
    this.vehicleS.cargarVehiculos()
    .subscribe( (resp: any) => {
        this.vehicles = resp.vehiculos;
    });
  }

  seleccionarVehicle(vehicle: Vehicle) {
    this.vehicle = vehicle;
    this.selected = true;
    this.pits = vehicle.pits;
    if (vehicle.basics != null) {
      this.basics = vehicle.basics;
    } else {
      this.basics = [];
    }
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

  borraVehiculo( vehicle: Vehicle ) {
    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar al vehículo con la placa #' + vehicle.plate,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {

      if (borrar) {
        this.vehicleS.borrarVehiculo( vehicle._id )
          .subscribe( (borrado: any) => {
            this.cargarVehiculos();
            this.icon = 'fas fa-info-circle';
            this.title = 'Vehículo borrado';
            this.type = '';
            this.info = 'Selecciona un vehículo para comenzar';
            this.selected = false;
          });
      }

    });
  }

  addBasic() {
    if (this.basic._id) {
      console.log('EDITANDO...');
      console.log(this.basics);
      // BUSCAMOS EL INDEX en el que se encuentra el item a editar dentro del arreglo de basics
      const index = this.basics.findIndex(item => item._id === this.basic._id);

      // REMPLAZAMOS EL BASIC en base al index encontrado
      this.basics.splice(index, 1 , this.basic);
      this.basic = {};
      this.vehicle.basics = this.basics;
      console.log(this.vehicle);
      this.vehicleS.crearVehiculo( this.vehicle )
        .subscribe( resp => {
          this.basics = resp.vehiculo.basics;
        });
      this.closeP.nativeElement.click();
    } else {
      console.log('GUARDANDO...');
      this.basics.push({
        code: this.basic.code,
        name: this.basic.name,
        description: this.basic.description
      });
      this.basic = {};
      this.vehicle.basics = this.basics;
      console.log(this.vehicle);
      this.vehicleS.crearVehiculo( this.vehicle )
        .subscribe( resp => {
          this.basics = resp.vehiculo.basics;
        });
      this.closeP.nativeElement.click();
    }
  }

  editarBasic( id: string ) {
    const status: Basics = this.basics.find(s => s._id === id);
    if (status) {
      this.basic = {
        _id: status._id,
        code: status.code,
        name: status.name,
        description: status.description
      }
    }
  }

  deleteBasic( id: string ) {
    console.log('BORRANDO...');
    console.log(this.basics);
    // BUSCAMOS EL INDEX en el que se encuentra el item a editar dentro del arreglo de basics
    const index = this.basics.findIndex(item => item._id === id);

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar información del vehículo que no se puede recuperar',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {
      if (borrar) {
        // ELIMINAMOS EL BASIC en base al index encontrado
        this.basics.splice(index, 1);
        // ACTUALIZAMOS LA DB
        this.vehicle.basics = this.basics;
        console.log(this.vehicle);
        this.vehicleS.crearVehiculo( this.vehicle )
          .subscribe( resp => {
            this.basics = resp.vehiculo.basics;
          });
      }
    });
  }
}
