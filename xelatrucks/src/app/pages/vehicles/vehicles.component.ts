import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import * as $ from 'jquery';
import * as moment from 'moment/moment';
import '../../../assets/vendor/select2/js/select2.js';
import { DatatablesService, VehicleService, PitService, GondolaService } from '../../services/service.index';
import { Vehicle } from '../../models/vehicle.model';
import { Basics } from '../../models/basics.model';
import { Pits } from '../../models/pits.model';
import { Rim } from '../../models/rim.model';
import { Gas } from '../../models/gas.model';
import { Gondola } from '../../models/gondola.model';

declare var swal: any;
declare function inputNumber();

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styles: []
})
export class VehiclesComponent implements OnInit, AfterViewInit {

  select2: any;
  public loading = false;
  date: string; // fecha de hoy

  // GONDOLA *********************************************************************************************
  @ViewChild('closeMGo') closeMGo: ElementRef;

  // Informacion de la Gondola
  isTruckG: boolean = false;
  inGondola: boolean = false;
  isGondola: boolean = false;
  inGas: boolean = false;

  // Gondolas Disponibles
  gondolasAv: Gondola[] = [];

  // Objeto de Gondola
  gondola: Gondola = { plate: '' };

  // VEHICULOS ******************************************************************************************
  @ViewChild('detalles') detalles: ElementRef;
  // Listado principal
  vehicles: Vehicle[] = [];
  gondolas: Gondola[] = [];

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
    _make: { _id: '', name: '_' },
    plate: '_',
    model: 0,
    state: false,
    km: 0.00,
    mts: 0.00
  };

  // BASICS ***********************************************************************************************
  @ViewChild('closeP') closeP: ElementRef;

  // listado
  basics: Basics[] = [];
  // Basic del form
  basic: Basics = {};

  // PITS **************************************************************************************************
  @ViewChild('closeMP') closeMP: ElementRef;
  @ViewChild('selectR') selectR: ElementRef;
  @ViewChild('closeMR') closeMR: ElementRef;
  @ViewChild('datePit') dateP: ElementRef;

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

  // GASOLINES ************************************************************************************************
  @ViewChild('dateG') dateG: ElementRef;
  @ViewChild('closeMG') closeMG: ElementRef;
  @ViewChild('date1') date1: ElementRef;
  @ViewChild('date2') date2: ElementRef;
  @ViewChild('codeG') codeG: ElementRef;

  gasolines: Gas[] = [];
  // form de GAS
  formGas: FormGroup;
  idGas: string = '';
  totalGas: number;
  totalGal: number;
  fecha1Consulta: string;
  fecha2Consulta: string;

  constructor(
    public dtService: DatatablesService,
    public vehicleS: VehicleService,
    public pitService: PitService,
    private chRef: ChangeDetectorRef,
    private gondolaS: GondolaService
  ) { }

  ngOnInit() {

    this.cargarVehiculos();
    this.cargarGondolas();

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

    this.formGas = new FormGroup({
      dateG: new FormControl(null),
      gallons: new FormControl(null, Validators.required),
      total: new FormControl(null, Validators.required),
      code: new FormControl(null)
    });

  }

  ngAfterViewInit() {
    $('.select2').select2();
  }

  resetModal() {
    this.formPit.reset();
    this.formPit.controls.axis.enable();
    this.formPit.controls.place.enable();
    this.formPit.controls.side.enable();
    this.formGas.reset();
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);
  }


  /* #region  GONDOLAS */

  cargarGondolas() {
    this.gondolaS.cargarGondolas()
      .subscribe((resp: any) => {
        this.gondolas = resp.gondolas;
      });
  }

  cargarDisponibles() {
    this.gondolaS.cargarDisponibles()
      .subscribe((res: any) => this.gondolasAv = res.gondolas);
  }

  seleccionarGondola(gondola: Gondola) {
    this.cargarRims();
    this.cargarHistorialPits(gondola._id, true);
    this.gondola = gondola;
    this.selected = true;
    this.isGondola = true;
    this.pits = gondola.pits;
    this.basics = gondola.basics;
    this.isTruckG = false;
    this.icon = 'fas fa-truck-moving';
    this.type = 'Gondola: ';
    this.title = this.gondola.plate;
    if (this.gondola._truck === null) {
      this.info = 'Camión sin asignar';
    } else {
      this.info = 'Camión asignado: ' + gondola._truck.plate;
    }
    if (this.inGas || this.inGondola) {
      this.detalles.nativeElement.click();
      this.inGas = false;
      this.inGondola = false;
    }
  }


  addGondola(formG: NgForm) {
    if (formG.invalid) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    const truck: Vehicle = {
      type: '',
      plate: '',
      _make: null,
      state: false,
      _id: null
    };

    if (this.gondola._id) {
      const gondola = new Gondola(formG.value.plateG, truck, this.gondola.basics, this.gondola.pits, false, this.gondola._id );
      this.gondolaS.crearGondola(gondola)
        .subscribe( (res: any) => {
          this.closeMGo.nativeElement.click();
          this.cargarGondolas();
          this.title = res.gondola.plate;
        });
    } else {

      const gondola = new Gondola(formG.value.plateG, truck);

      this.gondolaS.crearGondola(gondola)
        .subscribe( (res: any) => {
          this.closeMGo.nativeElement.click();
          this.cargarGondolas();
        });
    }

  }


  borrarGondola( gondola: Gondola ) {
    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de eliminar la góndola #' + gondola.plate,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then(borrar => {
      if (borrar) {
        gondola.state = true;
        this.gondolaS.borrarGondola(gondola)
          .subscribe( (res: any) => {
            this.cargarGondolas();
            this.icon = 'fas fa-info-circle';
            this.title = 'Góndola borrada';
            this.type = '';
            this.info = 'Selecciona un vehículo para comenzar';
            this.selected = false;
          });
        }

      });
  }

  asignarGondola( gondola: Gondola ) {

    gondola._truck = this.vehicle;

    this.gondolaS.asignarGondola(gondola)
      .subscribe( (res: any) => {

        this.vehicle._gondola = res.gondola;

        const index = this.gondolas.findIndex(item => item._id === res.gondola._id);
        this.gondolas.splice(index, 1, res.gondola);

      });

  }

  desasignarGondola( gondola: Gondola ) {

    const truck: Vehicle = {
      type: '',
      plate: '',
      _make: null,
      state: false,
      _id: null
    };


    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de remover la góndola del camión # ' + gondola.plate,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then(borrar => {
      if (borrar) {

          gondola._truck = truck;
          this.gondolaS.asignarGondola(gondola)
            .subscribe( (res: any) => {

              this.cargarDisponibles();
              this.vehicle._gondola = null;
              const index = this.gondolas.findIndex(item => item._id === res.gondola._id);
              this.gondolas.splice(index, 1, res.gondola);
            });
        }

      });
  }

  /* #endregion */

  /* #region  VEHICULOS */

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
    console.log(this.vehicle);
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

  borraVehiculo(vehicle: Vehicle) {
    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar al vehículo con la placa #' + vehicle.plate,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {

        if (borrar) {
          this.vehicleS.borrarVehiculo(vehicle._id)
            .subscribe((borrado: any) => {
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
  /* #endregion */

  /* #region  BASICS */
  addBasic() {
    if (this.basic._id) {
      console.log('EDITANDO...');
      console.log(this.basics);
      // BUSCAMOS EL INDEX en el que se encuentra el item a editar dentro del arreglo de basics
      const index = this.basics.findIndex(item => item._id === this.basic._id);

      // REMPLAZAMOS EL BASIC en base al index encontrado
      this.basics.splice(index, 1, this.basic);
      this.basic = {};
      // CONDICIONAMOS SI ES GONDOLA O TRUCK
      if (this.isGondola) {
          this.gondola.basics = this.basics;
          this.gondolaS.crearGondola( this.gondola )
            .subscribe(resp => {
              this.basics = resp.gondola.basics;
            });
      } else if (!this.isGondola) {
        this.vehicle.basics = this.basics;
        this.vehicleS.crearVehiculo(this.vehicle)
          .subscribe(resp => {
            this.basics = resp.vehiculo.basics;
          });
      }

      this.closeP.nativeElement.click();
    } else {
      console.log('GUARDANDO...');
      this.basics.push({
        code: this.basic.code,
        name: this.basic.name,
        description: this.basic.description
      });
      this.basic = {};
      if (this.isGondola) {
        this.gondola.basics = this.basics;
        console.log(this.gondola);
        this.gondolaS.crearGondola( this.gondola )
          .subscribe(resp => {
            this.basics = resp.gondola.basics;
          });
      } else if (!this.isGondola) {
        this.vehicle.basics = this.basics;
        console.log(this.vehicle);
        this.vehicleS.crearVehiculo(this.vehicle)
          .subscribe(resp => {
            this.basics = resp.vehiculo.basics;
          });
      }

      this.closeP.nativeElement.click();
    }
  }

  editarBasic(id: string) {
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

  deleteBasic(id: string) {
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
      .then(borrar => {
        if (borrar) {
          // ELIMINAMOS EL BASIC en base al index encontrado
          this.basics.splice(index, 1);
          // ACTUALIZAMOS LA DB
          if (!this.isGondola) {
            this.vehicle.basics = this.basics;
            console.log(this.vehicle);
            this.vehicleS.crearVehiculo(this.vehicle)
              .subscribe(resp => {
                this.basics = resp.vehiculo.basics;
              });
          } else if (this.isGondola) {
            this.gondola.basics = this.basics;
            this.gondolaS.crearGondola( this.gondola )
              .subscribe(resp => {
              this.basics = resp.gondola.basics;
              });
          }
        }
      });
  }
  /* #endregion */

  /* #region  PITS */
  cargarRims() {
    this.vehicleS.cargarRims()
      .subscribe((resp: any) => this.rims = resp.llantas);
  }

  cargarHistorialPits(id: string, isGondola: boolean) {
    this.pitService.cargarPits(id, isGondola)
      .subscribe((res: any) => {
        this.Hpits = res.pits;
        this.dtService.destroy_table();
        this.chRef.detectChanges();
        this.dtService.init_tables();
      });
  }

  addRim(forma: NgForm) {

    if (forma.invalid) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    const rim = new Rim(forma.value.codeR, forma.value.descR, false);

    this.vehicleS.guardarRim(rim)
      .subscribe((resp: any) => {
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

  addPit() {

    // Se llena la llanta de la con native element del select
    this.formPit.get('rim').setValue(this.selectR.nativeElement.value);

    const fecha = moment(this.dateP.nativeElement.value, 'DD/MM/YYYY').toDate();

    let pit;

    if (this.pitMain) {
      console.log('MANTENIMIENTO...');

      this.pitService.crearPit(this.pit, this.isGondola)
        .subscribe(resp => {
          this.Hpits.push({
            rim: resp.rim,
            km: resp.km,
            counter: resp.counter,
            axis: resp.axis,
            place: resp.place,
            side: resp.side,
            date: resp.date,
            total: resp.total,
            vehicle: resp.vehicle,
            gondola: resp.gondola
          });
          console.log(resp);
          if (this.isGondola) {
            this.cargarHistorialPits(resp.gondola._id, this.isGondola);
          } else if (!this.isGondola) {
            this.cargarHistorialPits(resp.vehicle._id, this.isGondola);
          }
        });
    }


    if (this.pit._id) {
      console.log('EDITANDO...');
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
      this.pit = {};
      $('.select2').val('').trigger('change');
      if (this.isGondola) {
        this.gondola.pits = this.pits;
        this.gondolaS.crearGondola(this.gondola)
          .subscribe(res => {
            this.pits = res.gondola.pits;

          });
      } else if (!this.isGondola) {
        this.vehicle.pits = this.pits;
        this.vehicleS.crearVehiculo(this.vehicle)
          .subscribe(resp => {
            this.pits = resp.vehiculo.pits;
          });
      }
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

      $('.select2').val('').trigger('change');
      if (this.isGondola) {
        console.log(this.gondola);
        this.gondola.pits = this.pits;
        this.gondolaS.crearGondola(this.gondola)
          .subscribe(res => {
            this.pits = res.gondola.pits;
          });

      } else if (!this.isGondola) {

        this.vehicle.pits = this.pits;
        this.vehicleS.crearVehiculo(this.vehicle)
          .subscribe(resp => {
            this.pits = resp.vehiculo.pits;
          });
      }
      this.closeMP.nativeElement.click();
    }
  }

  editarPit(id: string, main: boolean) {

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
        gondola: {
          plate: '',
          _id: this.gondola._id
        },
        _id: status._id
      };
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

  deletePit(id: string) {
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
      .then(borrar => {
        if (borrar) {
          // ELIMINAMOS EL BASIC en base al index encontrado
          this.pits.splice(index, 1);

          // ACTUALIZAMOS LA DB
          if (this.isGondola) {
            this.gondola.pits = this.pits;
            this.gondolaS.crearGondola(this.gondola)
              .subscribe( res => {
                this.pits = res.gondola.pits;
              });
          } else if (!this.isGondola) {

            this.vehicle.pits = this.pits;
            this.vehicleS.crearVehiculo(this.vehicle)
              .subscribe(resp => {
                this.pits = resp.vehiculo.pits;
              });
          }
        }
      });
  }
  /* #endregion */

  /* #region  GASOLINE */
  searchG() {
    this.loading = true;
    const id = this.vehicle._id;
    const fecha1 = moment(this.date1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.date2.nativeElement.value, 'DD/MM/YYYY').toDate();

    this.vehicleS.cargarGasolines(id, fecha1, fecha2).subscribe(resp => {
      console.log(resp);
      this.gasolines = resp;
      this.calcularTotalesG();
      this.fecha1Consulta = this.date1.nativeElement.value;
      this.fecha2Consulta = this.date2.nativeElement.value;
      this.loading = false;
    });
  }

  addGas() {

    const fecha = moment(this.dateG.nativeElement.value, 'DD/MM/YYYY').toDate();

    if (this.idGas !== '') {
      console.log('EDITANDO...');

      // BUSCAMOS EL INDEX en el que se encuentra el item a editar dentro del arreglo de basics
      const index = this.gasolines.findIndex(item => item._id === this.idGas);

      const gasoline = new Gas(
        fecha.toString(),
        this.formGas.value.gallons,
        this.formGas.value.total,
        this.formGas.value.code,
        false,
        this.idGas
      );

      // REMPLAZAMOS EL BASIC en base al index encontrado
      this.gasolines.splice(index, 1, gasoline);
      this.idGas = '';
      this.vehicle.gasoline = this.gasolines;
      this.vehicleS.crearGasoline(gasoline, this.vehicle._id)
        .subscribe(resp => { });

    } else {
      console.log('GUARDANDO...');

      const gasoline = new Gas(
        fecha.toString(),
        this.formGas.value.gallons,
        this.formGas.value.total,
        this.formGas.value.code,
        false
      );

      this.vehicleS.crearGasoline(gasoline, this.vehicle._id)
        .subscribe(resp => { });
    }

    this.closeMG.nativeElement.click();
    this.calcularTotalesG();
    this.formGas.reset();
  }

  editarGas(id: string) {

    const status: Gas = this.gasolines.find(s => s._id === id);

    if (status) {
      const fecha = this.dtService.fromJsonDate(status.date);

      this.formGas.get('dateG').setValue(fecha);
      this.formGas.get('code').setValue(status.code);
      this.formGas.get('gallons').setValue(status.gallons);
      this.formGas.get('total').setValue(status.total);
      this.dtService.init_datePicker(fecha);
      this.codeG.nativeElement.focus();
      this.idGas = status._id;
    }
  }

  deleteGas(id: string) {
    console.log('BORRANDO...');
    // BUSCAMOS EL INDEX en el que se encuentra el item a editar dentro del arreglo de basics
    const index = this.gasolines.findIndex(item => item._id === id);
    const status: Gas = this.gasolines.find(s => s._id === id);

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar información del consumo de gasolina de un vehiculo',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          // ELIMINAMOS EL BASIC en base al index encontrado
          this.gasolines.splice(index, 1);
          // ACTUALIZAMOS LA DB
          this.vehicle.gasoline = this.gasolines;

          const gasoline = new Gas(
            status.date,
            status.gallons,
            status.total,
            status.code,
            false,
            id
          );

          this.vehicleS.borrarGasoline(gasoline, this.vehicle._id)
            .subscribe(resp => { });

          this.calcularTotalesG();
        }
      });
  }

  calcularTotalesG() {
    // SUMAS PARA LOS TOTAL DE GASOLINA Y GALONES CONSUMIDOS -------------
    this.totalGas = this.gasolines.reduce((sum, item) => sum + item.total, 0);
    this.totalGal = this.gasolines.reduce((sum, item) => sum + item.gallons, 0);
    // ------------
  }
  /* #endregion */

}
