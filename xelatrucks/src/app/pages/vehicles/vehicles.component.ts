import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import * as $ from 'jquery';
import * as moment from 'moment/moment';
import '../../../assets/vendor/select2/js/select2.js';
import { DatatablesService, VehicleService, PitService } from '../../services/service.index';
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
  @ViewChild('closeMR') closeMR: ElementRef;
  @ViewChild('selectR') selectR: ElementRef;
  @ViewChild('datePit') dateP: ElementRef;
  select2: any;

  // fecha de hoy
  date: string;

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

  // form de PITS
  formPit: FormGroup;

  // Arreglo de pits
  pits: Pits[] = [];
  // Objeto de Pit
  pit: Pits = {};

  Hpits: Pits[] = [];
  pitMain: boolean;

  rims: Rim[] = [];
  rim: Rim = {
    code: '',
    desc: '',
    state: false
  };

  tempRim: string = '';

  constructor(
    public dtService: DatatablesService,
    public vehicleS: VehicleService,
    public pitService: PitService,
    private chRef: ChangeDetectorRef
    ) { }

  ngOnInit() {
    // this.dtService.init_tables();
    this.cargarVehiculos();

    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);

    // Inicializar form de los pits
    this.formPit = new FormGroup({
      axis: new FormControl(null, Validators.required),
      place: new FormControl(null, Validators.required),
      side: new FormControl(null, Validators.required),
      rim: new FormControl(''),
      date: new FormControl(null),
      total: new FormControl(0, Validators.required),
      km: new FormControl(0),
      counter: new FormControl(0)
    });

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

  cargarHistorialPits( id: string ) {
    this.pitService.cargarPits( id )
      .subscribe( (res: any) => {
        this.Hpits = res.pits;
        this.dtService.destroy_table();
        this.chRef.detectChanges();
        this.dtService.init_tables();
      });

  }

  seleccionarVehicle(vehicle: Vehicle) {
    this.cargarRims();
    this.cargarHistorialPits( vehicle._id );
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
      .subscribe( (resp: any) => {
        swal({
          title: 'Exito!',
          text: 'Llanta creada correctamente' + resp.desc,
          icon: 'success',
          button: false,
          timer: 1000
        });
        this.closeMR.nativeElement.click();
        this.cargarRims();
      });

  }

  resetModal() {
    this.formPit.reset();
    this.formPit.controls.axis.enable();
    this.formPit.controls.place.enable();
    this.formPit.controls.side.enable();
  }

  addPit() {

    // Se llena la llanta de la con native element del select
    this.formPit.get('rim').setValue(this.selectR.nativeElement.value);

    const fecha = moment(this.dateP.nativeElement.value, 'DD/MM/YYYY').toDate();

    let pit;

    if (this.pitMain) {
      console.log('MANTENIMIENTO...');

      this.pitService.crearPit( this.pit )
        .subscribe( resp => {
          this.Hpits.push({
            rim: resp.rim,
            km: resp.km,
            counter: resp.counter,
            axis: resp.axis,
            place: resp.place,
            side: resp.side,
            date: resp.date,
            total: resp.total,
            vehicle: resp.vehicle
          });
          this.cargarHistorialPits( resp.vehicle._id );
        });
    }


    if (this.pit._id) {
      console.log('EDITANDO...');
      console.log(this.pit);
      // BUSCAMOS EL INDEX en el que se encuentra el item a editar dentro del arreglo de basics
      const index = this.pits.findIndex(item => item._id === this.pit._id);

      pit = new Pits(
        this.formPit.value.rim,
        this.formPit.value.km,
        this.formPit.value.counter,
        this.formPit.getRawValue().axis,
        this.formPit.getRawValue().place,
        this.formPit.getRawValue().side,
        fecha.toString(),
        this.formPit.value.total,
        this.pit._id
      );

      // REMPLAZAMOS EL BASIC en base al index encontrado
      this.pits.splice(index, 1, pit);
      console.log(pit);
      this.pit = {};
      this.vehicle.pits = this.pits;
      console.log(this.vehicles);
      $('.select2').val('').trigger('change');
      this.vehicleS.crearVehiculo( this.vehicle )
      .subscribe( resp => {
        this.pits = resp.vehiculo.pits;
      });
      this.closeMP.nativeElement.click();
    } else {
      console.log('GUARDANDO...');
      this.pits.push({
        rim: this.formPit.value.rim,
        km: 0.00,
        counter: 0.00,
        axis: this.formPit.value.axis,
        place: this.formPit.value.place,
        side: this.formPit.value.side,
        date: fecha.toString(),
        total: this.formPit.value.total
      });
      this.vehicle.pits = this.pits;
      $('.select2').val('').trigger('change');
      this.vehicleS.crearVehiculo( this.vehicle )
        .subscribe( resp => {
          this.pits = resp.vehiculo.pits;
        });
      this.closeMP.nativeElement.click();
    }
    this.formPit.reset();
  }

  editarPit( id: string, main: boolean ) {

    const status: Pits = this.pits.find(s => s._id === id);

    const fecha = this.dtService.fromJsonDate(status.date);

    if (status) {
      this.formPit.get('axis').setValue(status.axis);
      this.formPit.get('place').setValue(status.place);
      this.formPit.get('side').setValue(status.side);
      this.formPit.get('date').setValue(fecha);
      this.formPit.get('total').setValue(status.total);
      this.formPit.get('rim').setValue(status.rim);
      this.formPit.get('km').setValue(status.km);
      this.formPit.get('counter').setValue(status.counter);
      this.pit = {
        rim: status.rim,
        km: status.km,
        counter: status.counter,
        axis: status.axis,
        place: status.place,
        side: status.side,
        date: status.date,
        total: status.total,
        vehicle: {
          type: '',
          _make: null,
          plate: '',
          state: false,
          _id: this.vehicle._id
        },
        _id: status._id
      }
    }

    if (main) {
      this.formPit.controls.axis.disable();
      this.formPit.controls.place.disable();
      this.formPit.controls.side.disable();
    } else {
      this.formPit.controls.axis.enable();
      this.formPit.controls.place.enable();
      this.formPit.controls.side.enable();
    }

    this.pitMain = main;

    $('.select2').val(status.rim._id).trigger('change');
    this.dtService.init_datePicker(fecha);
    this.vehicleS.cargarRims();
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
