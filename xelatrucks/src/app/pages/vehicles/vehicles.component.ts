import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as $ from 'jquery';
import '../../../assets/vendor/select2/js/select2.js';
import { DatatablesService, VehicleService } from '../../services/service.index';
import { Vehicle } from '../../models/vehicle.model';
import { Basics } from '../../models/basics.model';
import { Pits } from '../../models/pits.model';
import { Rim } from '../../models/rim.model';

declare var swal: any;

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styles: []
})
export class VehiclesComponent implements OnInit, AfterViewInit {

  @ViewChild('closeP') closeP: ElementRef;
  @ViewChild('closeMP') closeMP: ElementRef;
  @ViewChild('selectR') selectR: ElementRef;
  select2: any;

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
    km: 0.00,
    mts: 0.00
  };

  // Basics del vehiculo
  // listado
  basics: Basics[] = [];
  // Basic del form
  basic: Basics = {};

  pits: Pits[] = [];
  pit: Pits = {};

  rims: Rim[] = [];
  rim: Rim = {
    code: '',
    desc: '',
    state: false
  };

  tempRim: string = '';

  constructor(
    public dtService: DatatablesService,
    public vehicleS: VehicleService
    ) { }

  ngOnInit() {
    // this.dtService.init_tables();
    this.cargarVehiculos();
    this.dtService.init_datePicker();

  }

  ngAfterViewInit() {
    $('.select2').select2();
  }

  cargarVehiculos() {
    this.vehicleS.cargarVehiculos()
    .subscribe( (resp: any) => {
        this.vehicles = resp.vehiculos;
    });
  }

  cargarRims() {
    this.vehicleS.cargarRims()
      .subscribe((resp: any) => this.rims = resp.llantas );
  }

  seleccionarVehicle(vehicle: Vehicle) {
    this.cargarRims();
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
      };
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

  addRim( forma: NgForm ) {

    if (forma.invalid) {
      return;
    }

    const rim = new Rim(forma.value.codeR, forma.value.descR, false);

    this.vehicleS.guardarRim(rim)
      .subscribe( (res: any) => console.log(res));
  }

  addPit() {

    this.pit.rim = this.selectR.nativeElement.value;

    if (this.pit._id) {
      console.log('EDITANDO...');
      console.log(this.pits);
      console.log(this.pit);
      // BUSCAMOS EL INDEX en el que se encuentra el item a editar dentro del arreglo de basics
      const index = this.pits.findIndex(item => item._id === this.pit._id);

      // REMPLAZAMOS EL BASIC en base al index encontrado
      this.pits.splice(index, 1 , this.pit);
      this.pit = {};
      this.vehicle.pits = this.pits;
      console.log(this.vehicle);
      this.vehicleS.crearVehiculo( this.vehicle )
      .subscribe( resp => {
        this.pits = resp.vehiculo.pits;
      });
      this.closeMP.nativeElement.click();
    } else {
      console.log('GUARDANDO...');
      this.pits.push({
        rim: this.pit.rim,
        km: 0.00,
        counter: 0.00,
        axis: this.pit.axis,
        place: this.pit.place,
        side: this.pit.side,
        date: this.pit.date,
        total: this.pit.total
      });
      console.log(this.pits);
      this.pit = {};
      this.vehicle.pits = this.pits;
      console.log(this.vehicle);
      this.vehicleS.crearVehiculo( this.vehicle )
        .subscribe( resp => {
          this.pits = resp.vehiculo.pits;
        });
      this.closeMP.nativeElement.click();
    }
  }

  editarPit( id: string ) {

    const status: Pits = this.pits.find(s => s._id === id);

    if (status) {

      this.pit = {
        rim: status.rim,
        km: status.km,
        counter: status.counter,
        axis: status.axis,
        place: status.place,
        side: status.side,
        date: status.date,
        total: status.total,
        _id: status._id
      };
    }

    $('.select2').val(status.rim._id).trigger('change');
    this.dtService.init_datePicker();
    this.vehicleS.cargarRims();
    console.log(this.tempRim);
  }
  
  deletePit( id: string ) {
    console.log('BORRANDO...');
    console.log(this.pits);
    // BUSCAMOS EL INDEX en el que se encuentra el item a editar dentro del arreglo de basics
    const index = this.pits.findIndex(item => item._id === id);

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
        this.pits.splice(index, 1);
        // ACTUALIZAMOS LA DB
        this.vehicle.pits = this.pits;
        console.log(this.vehicle);
        this.vehicleS.crearVehiculo( this.vehicle )
          .subscribe( resp => {
            this.pits = resp.vehiculo.pits;
          });
      }
    });
  }
}
