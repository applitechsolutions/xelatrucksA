import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Vehicle } from '../../models/vehicle.model';
import { Gondola } from '../../models/gondola.model';
import { GondolaService, VehicleService, UserService, MechanicService, MaintenanceService } from '../../services/service.index';
import * as $ from 'jquery';
import * as moment from 'moment/moment';
import '../../../assets/vendor/select2/js/select2.js';
import { User } from 'src/app/models/user.model';
import { Mechanic } from '../../models/mech.model';
import { Maintenance } from '../../models/maintenance.model';
import { TypeMaintenance } from '../../models/typeMaintenance.model';
import { TypeMaintenanceService } from '../../services/typeMaintenances/type-maintenance.service';
import { DetailsSpare } from 'src/app/models/detailsSpare.model';
import { BuySpareService } from '../../services/buySpares/buy-spare.service';
import { PartService } from '../../services/parts/part.service';

declare var swal: any;
declare function init_step();

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styles: []
})
export class MaintenanceComponent implements OnInit, AfterViewInit {
  @ViewChild('selectM') selectM: ElementRef;
  @ViewChild('selectT') selectT: ElementRef;
  public loading = false;
  select2: any;

  // Listado principal
  vehicles: Vehicle[] = [];
  gondolas: Gondola[] = [];
  mecanicos: Mechanic[] = []; // Llenar SELECT
  typeMaintenances: TypeMaintenance[] = []; // Llenar SELECT
  mechanics: Mechanic[] = []; // Mantenimiento

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
  idCellar: string;

  constructor(
    public gondolaS: GondolaService,
    public vehicleS: VehicleService,
    public userS: UserService,
    public mechS: MechanicService,
    public typeS: TypeMaintenanceService,
    public maintenanceS: MaintenanceService,
    public partS: PartService,
    public buySpareS: BuySpareService
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
            // console.log(this.storages.map( (resp: any) => resp._autopart ));
          });
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
        this.maintenanceS.crearMantenimiento(this.mantenimiento)
          .subscribe((resp: any) => {
            this.mantenimiento = resp.mantenimiento;
            this.mechanics = this.mantenimiento._mech;
            this.lastUser = this.mantenimiento._user;
            this.dateStart = this.mantenimiento.dateStart.toString();
          });
      }
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

    this.maintenanceS.crearMantenimiento(this.mantenimiento)
      .subscribe((resp: any) => {
        this.mantenimiento = resp.mantenimiento;
        this.mechanics = this.mantenimiento._mech;
        this.lastUser = this.mantenimiento._user;
        this.dateStart = this.mantenimiento.dateStart.toString();
      });
  }
  /* #endregion */

  /* #region  GONDOLAS */
  cargarGondolas() {
    this.gondolaS.cargarGondolas()
      .subscribe((resp: any) => {
        this.gondolas = resp.gondolas;
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
            _gondola: { plate: '', _id: null },
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
