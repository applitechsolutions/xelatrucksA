import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {
  VehicleService,
  GondolaService,
  DatatablesService,
  PartService,
  UserService,
  TypeMaintenanceService,
  MechanicService,
  MaintenanceService
} from 'src/app/services/service.index';
import { Vehicle } from 'src/app/models/vehicle.model';
import { Gondola } from 'src/app/models/gondola.model';
import { Mechanic } from 'src/app/models/mech.model';
import { TypeMaintenance } from 'src/app/models/typeMaintenance.model';
import { DetailsSpare } from 'src/app/models/detailsSpare.model';
import { Maintenance } from 'src/app/models/maintenance.model';

import * as $ from 'jquery';
import * as moment from 'moment/moment';
declare var swal: any;

@Component({
  selector: 'app-repairs',
  templateUrl: './repairs.component.html',
  styles: []
})
export class RepairsComponent implements OnInit, AfterViewInit {

  @ViewChild('selectV', { static: false }) selectV: ElementRef;
  @ViewChild('selectG', { static: false }) selectG: ElementRef;
  @ViewChild('selectM', { static: false }) selectM: ElementRef;
  @ViewChild('selectM2', { static: false }) selectM2: ElementRef;
  @ViewChild('selectT', { static: false }) selectT: ElementRef;
  @ViewChild('selectT2', { static: false }) selectT2: ElementRef;
  @ViewChild('selectRV', { static: false }) selectRV: ElementRef;
  @ViewChild('selectRG', { static: false }) selectRG: ElementRef;
  @ViewChild('dateV', { static: false }) dateV: ElementRef;
  @ViewChild('dateG', { static: false }) dateG: ElementRef;
  public loading = false;

  vehicles: Vehicle[] = [];
  gondolas: Gondola[] = [];
  mecanicos: Mechanic[] = []; // Llenar SELECT
  typeMaintenances: TypeMaintenance[] = []; // Llenar SELECT
  mechanics: Mechanic[] = []; // Mantenimiento ARREGLO
  mechanics2: Mechanic[] = []; // Mantenimiento ARREGLO

  // Objetos para repuestos
  storages: Storage[] = [];
  detailsV: DetailsSpare[] = [];
  detailsG: DetailsSpare[] = [];
  detail: DetailsSpare = {
    _part: { code: '', desc: '', minStock: 0, state: false, _id: '' },
    quantity: null,
    cost: null
  };
  idCellar: string = '';

  // Inicializar Mantenimiento
  mantenimientoV: Maintenance = {
    _user: null,
    _vehicle: null,
    _gondola: null,
    detailsRev: '',
    detailsRep: '',
    totalV: 0,
    state: true
  };

  // Inicializar Mantenimiento
  mantenimientoG: Maintenance = {
    _user: null,
    _vehicle: null,
    _gondola: null,
    detailsRev: '',
    detailsRep: '',
    totalG: 0,
    state: true
  };

  constructor(
    public userS: UserService,
    public vehicleS: VehicleService,
    public gondolaS: GondolaService,
    public dtS: DatatablesService,
    public partS: PartService,
    public typeS: TypeMaintenanceService,
    public mechS: MechanicService,
    public maintenanceS: MaintenanceService
  ) { }

  ngOnInit() {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtS.init_datePicker(today);
    this.cargarVehiculos();
    this.cargarGondolas();
    this.cargarTipos();
    this.cargarMecanicos();
    this.getStorages();
  }

  ngAfterViewInit(): void {
    $('.select2').select2();
  }

  cargarGondolas() {
    this.gondolaS.cargarGondolas()
      .subscribe((resp: any) => {
        this.gondolas = resp.gondolas;
      });
  }

  cargarVehiculos() {
    this.vehicleS.cargarVehiculos()
      .subscribe((resp: any) => {
        this.vehicles = resp.vehiculos;
      });
  }

  cargarTipos() {
    this.typeS.cargarTipos()
      .subscribe((resp: any) => {
        this.typeMaintenances = resp.tipos;
      });
  }

  /* #region  MANTENIMIENTOS */
  crearMantenimientoV() {
    if (this.selectV.nativeElement.value === '' || this.dateV.nativeElement.value === '' || this.selectT.nativeElement.value === '') {
      swal('Oops...', 'Por favor ingrese los campos obligatorios', 'warning');
      return;
    }

    this.loading = true;
    const fecha = moment(this.dateV.nativeElement.value, 'DD/MM/YYYY').toDate();
    const vehicle = this.vehicles.find(e => e._id === this.selectV.nativeElement.value);

    this.mantenimientoV._user = this.userS.usuario;
    this.mantenimientoV._vehicle = vehicle;
    this.mantenimientoV._mech = this.mechanics;
    this.mantenimientoV.detailsV = this.detailsV;
    this.mantenimientoV.typeMaintenance = this.selectT.nativeElement.value;
    this.mantenimientoV.dateStart = fecha;
    this.mantenimientoV.dateEnd = fecha;
    this.mantenimientoV.totalG = 0.00;

    this.maintenanceS.crearAjuste(this.mantenimientoV)
      .subscribe((resp: any) => {
        // Vaciar mantenimiento
        this.mantenimientoV = {
          _user: null,
          _vehicle: null,
          _gondola: null,
          detailsRev: '',
          detailsRep: '',
          totalV: 0,
          state: true
        };
        this.mechanics = [];
        this.detailsV = [];
        this.loading = false;
      });
  }

  crearMantenimientoG() {
    if (this.selectG.nativeElement.value === '' || this.dateG.nativeElement.value === '' || this.selectT2.nativeElement.value === '') {
      swal('Oops...', 'Por favor ingrese los campos obligatorios', 'warning');
      return;
    }

    this.loading = true;
    const fecha = moment(this.dateG.nativeElement.value, 'DD/MM/YYYY').toDate();
    const gondola = this.gondolas.find(e => e._id === this.selectG.nativeElement.value);

    this.mantenimientoG._user = this.userS.usuario;
    this.mantenimientoG._gondola = gondola;
    this.mantenimientoG._mech = this.mechanics2;
    this.mantenimientoG.detailsG = this.detailsG;
    this.mantenimientoG.typeMaintenance = this.selectT2.nativeElement.value;
    this.mantenimientoG.dateStart = fecha;
    this.mantenimientoG.dateEnd = fecha;
    this.mantenimientoG.totalV = 0.00;

    this.maintenanceS.crearAjuste(this.mantenimientoG)
      .subscribe((resp: any) => {
        // Vaciar mantenimiento
        this.mantenimientoG = {
          _user: null,
          _vehicle: null,
          _gondola: null,
          detailsRev: '',
          detailsRep: '',
          totalG: 0,
          state: true
        };
        this.mechanics2 = [];
        this.detailsG = [];
        this.loading = false;
      });
  }
  /* #endregion */

  /* #region  MECANICOS */
  cargarMecanicos() {
    this.mechS.cargarMecanicos()
      .subscribe((resp: any) => {
        this.mecanicos = resp.mecanicos;
      });
  }

  addMech() {
    if (this.selectM.nativeElement.value === '') {
      swal('Oops...', 'Por favor selecciona un mecánico', 'warning');
      return;
    }
    if (this.mechanics.find(e => e._id === this.selectM.nativeElement.value)) {
      swal('Oops...', 'El mecánico ha sido agregado', 'warning');
      return;
    } else {
      const mech = this.mecanicos.find(e => e._id === this.selectM.nativeElement.value);
      this.mechanics.push({
        code: mech.code,
        name: mech.name,
        state: mech.state,
        _id: mech._id
      });
    }

  }

  addMech2() {
    if (this.selectM2.nativeElement.value === '') {
      swal('Oops...', 'Por favor selecciona un mecánico', 'warning');
      return;
    }
    if (this.mechanics2.find(e => e._id === this.selectM2.nativeElement.value)) {
      swal('Oops...', 'El mecánico ha sido agregado', 'warning');
      return;
    } else {
      const mech = this.mecanicos.find(e => e._id === this.selectM2.nativeElement.value);
      this.mechanics2.push({
        code: mech.code,
        name: mech.name,
        state: mech.state,
        _id: mech._id
      });
    }

  }

  deleteMech(id: string) {
    console.log('BORRANDO...');
    // BUSCAMOS EL INDEX en el que se encuentra el item a editar dentro del arreglo de basics
    const index = this.mechanics.findIndex(item => item._id === id);

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar un mecánico del mantenimiento',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          // BUSCAMOS LA FILA DENTRO DEL ARREGLO PARA TENER LOS DATOS
          const row = this.mechanics.find(e => e._id === id);
          // ELIMINAMOS EL DETALLE en base al index encontrado
          this.mechanics.splice(index, 1);
        }
      });
  }

  deleteMech2(id: string) {
    console.log('BORRANDO...');
    // BUSCAMOS EL INDEX en el que se encuentra el item a editar dentro del arreglo de basics
    const index = this.mechanics2.findIndex(item => item._id === id);

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar un mecánico del mantenimiento',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          // BUSCAMOS LA FILA DENTRO DEL ARREGLO PARA TENER LOS DATOS
          const row = this.mechanics2.find(e => e._id === id);
          // ELIMINAMOS EL DETALLE en base al index encontrado
          this.mechanics2.splice(index, 1);
        }
      });
  }
  /* #endregion */

  /* #region  REPUESTOS */
  getStorages() {
    this.partS.cargarRepuestos()
      .subscribe((resp: any) => {
        resp.repuestos
          .map((res: any) => {
            this.storages = res.storage;
            this.idCellar = res._id;
            // console.log(this.storages);
            $('.select2').select2();
            // console.log(this.storages.map( (resp: any) => resp._autopart ));
          });
      });
  }

  addDetailsV() {
    if (this.selectRV.nativeElement.value === '' || this.detail.quantity === null) {
      swal('Oops...', 'Por favor ingrese los campos obligatorios', 'warning');
      return;
    }
    const part = this.storages.find(e => e._autopart._id === this.selectRV.nativeElement.value);
    if (this.detail.quantity > part.stock) {
      swal('Oops...', 'No hay existencias', 'warning');
      return;
    }
    if (this.detailsV.find(e => e._part._id === this.selectRV.nativeElement.value)) {
      const row = this.detailsV.find(e => e._part._id === this.selectRV.nativeElement.value);
      const index = this.detailsV.findIndex(e => e._part._id === this.selectRV.nativeElement.value);
      // RESTAR EL SUBTOTAL AL TOTAL DEL RESGISTRO YA EXISTENTE
      this.mantenimientoV.totalV = this.mantenimientoV.totalV - (this.detail.quantity * this.detail.cost);
      // ACTUALIZO EL STOCK PARA NO RESTARLE DOS VECES LA MISMA CANTIDAD
      this.detail._part = row._part;
      this.partS.stockSale(this.detail)
      .subscribe( (resp: any) => {
        // console.log('STOCK OK');
        this.getStorages();
      });
      // RECALCULO LA CANTIDAD Y EL SUBTOTAL
      this.detail.quantity = row.quantity + this.detail.quantity;
      // REMPLAZAMOS EL REPUESTO en base al index encontrado
      this.detailsV.splice(index, 1, this.detail);
    } else {
      this.detail._part = part._autopart;
      this.detail.cost = part.cost;
      this.detailsV.push({
        _part: this.detail._part,
        quantity: this.detail.quantity,
        cost: this.detail.cost
      });
      this.partS.stockSale(this.detail)
      .subscribe( (resp: any) => {
        // console.log('STOCK OK');
        this.getStorages();
      });
    }
    // SUMAR AL TOTAL
    console.log(this.detail.cost);
    this.mantenimientoV.totalV = this.mantenimientoV.totalV + (this.detail.quantity * this.detail.cost);
    console.log(this.mantenimientoV.totalV);
    this.mantenimientoV._user = this.userS.usuario;
    this.mantenimientoV.detailsV = this.detailsV;
    this.detail = {
      _part: { code: '', desc: '', minStock: 0, state: false, _id: '' },
      quantity: null,
      cost: null
    };
  }
  addDetailsG() {
    if (this.selectRG.nativeElement.value === '' || this.detail.quantity === null) {
      swal('Oops...', 'Por favor ingrese los campos obligatorios', 'warning');
      return;
    }
    const part = this.storages.find(e => e._autopart._id === this.selectRG.nativeElement.value);
    if (this.detail.quantity > part.stock) {
      swal('Oops...', 'No hay existencias', 'warning');
      return;
    }
    if (this.detailsG.find(e => e._part._id === this.selectRG.nativeElement.value)) {
      const row = this.detailsG.find(e => e._part._id === this.selectRG.nativeElement.value);
      const index = this.detailsG.findIndex(e => e._part._id === this.selectRG.nativeElement.value);
      // RESTAR EL SUBTOTAL AL TOTAL DEL RESGISTRO YA EXISTENTE
      this.mantenimientoG.totalG = this.mantenimientoG.totalG - (this.detail.quantity * this.detail.cost);
      // ACTUALIZO EL STOCK PARA NO RESTARLE DOS VECES LA MISMA CANTIDAD
      this.detail._part = row._part;
      this.partS.stockSale(this.detail)
      .subscribe( (resp: any) => {
        // console.log('STOCK OK');
        this.getStorages();
      });
      // RECALCULO LA CANTIDAD Y EL SUBTOTAL
      this.detail.quantity = row.quantity + this.detail.quantity;
      // REMPLAZAMOS EL REPUESTO en base al index encontrado
      this.detailsG.splice(index, 1, this.detail);
    } else {
      this.detail._part = part._autopart;
      this.detail.cost = part.cost;
      this.detailsG.push({
        _part: this.detail._part,
        quantity: this.detail.quantity,
        cost: this.detail.cost
      });
      this.partS.stockSale(this.detail)
      .subscribe( (resp: any) => {
        // console.log('STOCK OK');
        this.getStorages();
      });
    }
    // SUMAR AL TOTAL
    console.log(this.detail.cost);
    this.mantenimientoG.totalG = this.mantenimientoG.totalG + (this.detail.quantity * this.detail.cost);
    console.log(this.mantenimientoG.totalG);
    this.mantenimientoG._user = this.userS.usuario;
    this.mantenimientoG.detailsG = this.detailsG;
    // this.updateMantenimiento();
    this.detail = {
      _part: { code: '', desc: '', minStock: 0, state: false, _id: '' },
      quantity: null,
      cost: null
    };
  }

  deleteDetailV(id: string) {
    console.log('BORRANDO...');
    console.log(this.detailsV);
    // BUSCAMOS EL INDEX en el que se encuentra el item a editar dentro del arreglo de basics
    const index = this.detailsV.findIndex(item => item._part._id === id);

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar un registro del detalle, esto afectará el registro del mantenimiento',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          // BUSCAMOS LA FILA DENTRO DEL ARREGLO PARA TENER LOS DATOS
          const row = this.detailsV.find(e => e._part._id === id);
          this.partS.stockPurchase(row)
          .subscribe( (resp: any) => {
            // console.log('STOCK OK');
            this.getStorages();
          });
          // ACTUALIZAMOS el total
          this.mantenimientoV.totalV = this.mantenimientoV.totalV - (row.quantity * row.cost);
          this.mantenimientoV._user = this.userS.usuario;
          this.mantenimientoV.detailsV = this.detailsV;
          // this.updateMantenimiento();
          // ELIMINAMOS EL DETALLE en base al index encontrado
          this.detailsV.splice(index, 1);

        }
      });
  }

  deleteDetailG(id: string) {
    console.log('BORRANDO...');
    console.log(this.detailsG);
    // BUSCAMOS EL INDEX en el que se encuentra el item a editar dentro del arreglo de basics
    const index = this.detailsG.findIndex(item => item._part._id === id);

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar un registro del detalle, esto afectará el registro del mantenimiento',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          // BUSCAMOS LA FILA DENTRO DEL ARREGLO PARA TENER LOS DATOS
          const row = this.detailsG.find(e => e._part._id === id);
          this.partS.stockPurchase(row)
          .subscribe( (resp: any) => {
            // console.log('STOCK OK');
            this.getStorages();
          });
          // ACTUALIZAMOS el total
          this.mantenimientoG.totalG = this.mantenimientoG.totalG - (row.quantity * row.cost);
          this.mantenimientoG._user = this.userS.usuario;
          this.mantenimientoG.detailsG = this.detailsG;
          // this.updateMantenimiento();
          // ELIMINAMOS EL DETALLE en base al index encontrado
          this.detailsG.splice(index, 1);

        }
      });
  }
  /* #endregion */

}
