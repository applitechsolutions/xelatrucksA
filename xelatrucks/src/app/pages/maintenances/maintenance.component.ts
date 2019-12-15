import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import {
  GondolaService,
  VehicleService,
  UserService,
  MechanicService,
  MaintenanceService,
  TypeMaintenanceService,
  BuySpareService,
  PartService,
  DatatablesService
} from '../../services/service.index';
import { Vehicle } from '../../models/vehicle.model';
import { Gondola } from '../../models/gondola.model';
import { User } from 'src/app/models/user.model';
import { Mechanic } from '../../models/mech.model';
import { Maintenance } from '../../models/maintenance.model';
import { TypeMaintenance } from '../../models/typeMaintenance.model';
import { DetailsSpare } from 'src/app/models/detailsSpare.model';

import * as $ from 'jquery';
import '../../../assets/vendor/select2/js/select2.js';
import PerfectScrollbar from 'perfect-scrollbar';

declare var swal: any;
declare function init_step();

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styles: []
})
export class MaintenanceComponent implements OnInit, AfterViewInit {

  @ViewChild('selectM', { static: false }) selectM: ElementRef;
  @ViewChild('selectT', { static: false }) selectT: ElementRef;
  @ViewChild('selectRV', { static: false }) selectRV: ElementRef;
  @ViewChild('selectRG', { static: false }) selectRG: ElementRef;
  @ViewChild('scroll', { static: false }) scroll: ElementRef;
  public loading = false;
  select2: any;

  // Listado principal
  vehicles: Vehicle[] = [];
  gondolas: Gondola[] = [];
  mecanicos: Mechanic[] = []; // Llenar SELECT
  typeMaintenances: TypeMaintenance[] = []; // Llenar SELECT
  mechanics: Mechanic[] = []; // Mantenimiento ARREGLO

  // Info principal
  icon: string = 'fas fa-info-circle';
  title: string = 'Información';
  type: string = '';
  info: string = 'Selecciona un vehículo para comenzar';
  selected: boolean = false;
  isTruckG: boolean = false;
  isGondola: boolean = false;
  usuario: User;
  lastUser: User;
  dateStart: string;
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

  // Objetos para repuestos
  storages: Storage[] = [];
  detailsV: DetailsSpare[] = [];
  detailsG: DetailsSpare[] = [];
  detail: DetailsSpare = {
    _part: { code: '', desc: '', minStock: 0, state: false, _id: '' },
    quantity: null,
    cost: null
  };
  tempPart: string = '';
  idCellar: string = '';
  totalV: number = 0;
  totalG: number = 0;

  constructor(
    public gondolaS: GondolaService,
    public vehicleS: VehicleService,
    public userS: UserService,
    public mechS: MechanicService,
    public typeS: TypeMaintenanceService,
    public maintenanceS: MaintenanceService,
    public partS: PartService,
    public buySpareS: BuySpareService,
    public dtS: DatatablesService
  ) { }

  // Inicializar Mantenimiento
  mantenimiento: Maintenance = {
    _user: null,
    _vehicle: null,
    _gondola: null,
    detailsRev: '',
    detailsRep: ''
  };

  ngOnInit() {
    this.cargarVehiculos();
    this.cargarGondolas();
    this.cargarTipos();
    this.cargarMecanicos();
    this.usuario = this.userS.usuario;
    this.getStorages();
    this.dtS.init_datePicker2();
  }

  ngAfterViewInit(): void {
    init_step();
    $('.select2').select2();
  }

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
      this.mantenimiento.totalV = this.mantenimiento.totalV - (this.detail.quantity * this.detail.cost);
      // ACTUALIZO EL STOCK PARA NO RESTARLE DOS VECES LA MISMA CANTIDAD
      this.detail._part = row._part;
      this.partS.stockSale(this.detail)
        .subscribe((resp: any) => {
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
        .subscribe((resp: any) => {
          // console.log('STOCK OK');
          this.getStorages();
        });
    }
    // SUMAR AL TOTAL
    // console.log(this.detail.cost);
    this.mantenimiento.totalV = this.mantenimiento.totalV + (this.detail.quantity * this.detail.cost);
    // console.log(this.mantenimiento.totalV);
    this.mantenimiento._user = this.userS.usuario;
    this.mantenimiento.detailsV = this.detailsV;
    this.updateMantenimiento();
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
      this.mantenimiento.totalG = this.mantenimiento.totalG - (this.detail.quantity * this.detail.cost);
      // ACTUALIZO EL STOCK PARA NO RESTARLE DOS VECES LA MISMA CANTIDAD
      this.detail._part = row._part;
      this.partS.stockSale(this.detail)
        .subscribe((resp: any) => {
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
        .subscribe((resp: any) => {
          // console.log('STOCK OK');
          this.getStorages();
        });
    }
    // SUMAR AL TOTAL
    // console.log(this.detail.cost);
    this.mantenimiento.totalG = this.mantenimiento.totalG + (this.detail.quantity * this.detail.cost);
    // console.log(this.mantenimiento.totalG);
    this.mantenimiento._user = this.userS.usuario;
    this.mantenimiento.detailsG = this.detailsG;
    this.updateMantenimiento();
    this.detail = {
      _part: { code: '', desc: '', minStock: 0, state: false, _id: '' },
      quantity: null,
      cost: null
    };
  }

  deleteDetailV(id: string) {
    // console.log('BORRANDO...');
    // console.log(this.detailsV);
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
            .subscribe((resp: any) => {
              // console.log('STOCK OK');
              this.getStorages();
            });
          // ACTUALIZAMOS el total
          this.mantenimiento.totalV = this.mantenimiento.totalV - (row.quantity * row.cost);
          this.mantenimiento._user = this.userS.usuario;
          this.mantenimiento.detailsV = this.detailsV;
          this.updateMantenimiento();
          // ELIMINAMOS EL DETALLE en base al index encontrado
          this.detailsV.splice(index, 1);

        }
      });
  }

  deleteDetailG(id: string) {
    // console.log('BORRANDO...');
    // console.log(this.detailsG);
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
            .subscribe((resp: any) => {
              // console.log('STOCK OK');
              this.getStorages();
            });
          // ACTUALIZAMOS el total
          this.mantenimiento.totalG = this.mantenimiento.totalG - (row.quantity * row.cost);
          this.mantenimiento._user = this.userS.usuario;
          this.mantenimiento.detailsG = this.detailsG;
          this.updateMantenimiento();
          // ELIMINAMOS EL DETALLE en base al index encontrado
          this.detailsG.splice(index, 1);

        }
      });
  }

  /* #endregion */

  /* #region  MANTENIMIENTOS */
  cargarTipos() {
    this.typeS.cargarTipos()
      .subscribe((resp: any) => {
        this.typeMaintenances = resp.tipos;
      });
  }

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
      if (this.mantenimiento._id !== null) {
        this.mantenimiento._user = this.userS.usuario;
        this.mantenimiento._mech = this.mechanics;
        this.updateMantenimiento();
      }
    }

  }

  deleteMech(id: string) {
    // console.log('BORRANDO...');
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
          if (this.mantenimiento._id !== null) {
            this.mantenimiento._user = this.userS.usuario;
            this.mantenimiento._mech = this.mechanics;
            this.maintenanceS.crearMantenimiento(this.mantenimiento)
              .subscribe((resp: any) => {
                this.mantenimiento = resp.mantenimiento;
                this.mechanics = this.mantenimiento._mech;
                this.lastUser = this.mantenimiento._user;
                this.dateStart = this.mantenimiento.dateStart.toString();
              });
          }
        }
      });
  }

  updateMantenimiento() {
    this.maintenanceS.crearMantenimiento(this.mantenimiento)
      .subscribe((resp: any) => {
        this.mantenimiento = resp.mantenimiento;
        this.mechanics = this.mantenimiento._mech;
        this.lastUser = this.mantenimiento._user;
        this.dateStart = this.mantenimiento.dateStart.toString();
      });
  }

  crearMantenimiento() {

    if (this.mantenimiento._user !== null) {
      return;
    }
    const fecha = new Date();
    this.mantenimiento._user = this.userS.usuario;
    this.mantenimiento._mech = this.mechanics;
    this.mantenimiento.dateStart = fecha;
    this.mantenimiento.totalV = 0.00;
    this.mantenimiento.totalG = 0.00;

    if (this.isTruckG) {
      this.mantenimiento._gondola = this.vehicle._gondola;
    }

    this.maintenanceS.crearMantenimiento(this.mantenimiento)
      .subscribe((resp: any) => {
        this.mantenimiento = resp.mantenimiento;
        this.mechanics = this.mantenimiento._mech;
        this.lastUser = this.mantenimiento._user;
        this.dateStart = this.mantenimiento.dateStart.toString();
        this.detailsV = this.mantenimiento.detailsV;
        this.detailsG = this.mantenimiento.detailsG;
      });
  }

  finalizarMantenimiento() {

    if (this.selectT.nativeElement.value === '') {
      swal('Oops...', 'Por favor selecciona un tipo de mantenimiento', 'warning');
      return;
    }
    const fecha = new Date();
    this.mantenimiento.typeMaintenance = this.selectT.nativeElement.value;
    this.mantenimiento.dateEnd = fecha;
    this.mantenimiento.state = true;

    this.maintenanceS.finishMantenimiento(this.mantenimiento)
      .subscribe((resp: any) => {
        // console.log(resp);
        this.mantenimiento = {
          _user: null,
          _vehicle: {
            no: 0,
            cp: '_',
            type: '',
            _make: { _id: '', name: '_' },
            plate: '_',
            model: 0,
            state: false,
            km: 0.00,
            mts: 0.00,
            _id: null
          },
          _gondola: { plate: '', _id: null },
          _id: null
        };
        this.mechanics = [];
        this.lastUser = { name: '', email: '', password: '', role: '', state: false };
        this.dateStart = null;
      });
  }
  /* #endregion */

  /* #region  GONDOLAS */
  cargarGondolas() {
    this.gondolaS.cargarGondolas()
      .subscribe((resp: any) => {
        this.gondolas = resp.gondolas;
        const ps = new PerfectScrollbar(this.scroll.nativeElement);
      });
  }

  seleccionarGondola(gondola: Gondola) {
    this.loading = true;
    this.maintenanceS.cargarActiveG(gondola._id)
      .subscribe((resp: any) => {
        if (resp.mantenimiento === null) {
          this.mantenimiento = {
            _user: null,
            _vehicle: {
              no: 0,
              cp: '_',
              type: '',
              _make: { _id: '', name: '_' },
              plate: '_',
              model: 0,
              state: false,
              km: 0.00,
              mts: 0.00,
              _id: null
            },
            _gondola: gondola,
            _id: null
          };
          this.mechanics = [];
          this.lastUser = { name: '', email: '', password: '', role: '', state: false };
          this.dateStart = null;
        } else {
          this.mantenimiento = resp.mantenimiento;
          this.mechanics = this.mantenimiento._mech;
          this.lastUser = this.mantenimiento._user;
          this.dateStart = this.mantenimiento.dateStart.toString();
          this.detailsV = this.mantenimiento.detailsV;
          this.detailsG = this.mantenimiento.detailsG;
        }
      });
    this.gondola = gondola;
    this.selected = true;
    this.isGondola = true;
    this.isTruckG = false;
    this.icon = 'fas fa-truck-moving';
    this.type = 'Gondola: ';
    this.title = this.gondola.plate;
    if (this.gondola._truck === null) {
      this.info = 'Camión sin asignar';
    } else {
      this.info = 'Camión asignado: ' + gondola._truck.plate;
    }
    this.loading = false;
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
    this.loading = true;
    this.maintenanceS.cargarActiveV(vehicle._id)
      .subscribe((resp: any) => {
        if (resp.mantenimiento === null) {
          this.mantenimiento = {
            _user: null,
            _vehicle: vehicle,
            _gondola: null,
            _id: null
          };
          this.mechanics = [];
          this.lastUser = { name: '', email: '', password: '', role: '', state: false };
          this.dateStart = null;
        } else {
          this.mantenimiento = resp.mantenimiento;
          this.mechanics = this.mantenimiento._mech;
          this.lastUser = this.mantenimiento._user;
          this.dateStart = this.mantenimiento.dateStart.toString();
          this.detailsV = this.mantenimiento.detailsV;
          this.detailsG = this.mantenimiento.detailsG;
        }
      });
    this.vehicle = vehicle;
    this.selected = true;
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
    this.loading = false;
  }
  /* #endregion */
}
