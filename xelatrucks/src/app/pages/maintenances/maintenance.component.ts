import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { Vehicle } from '../../models/vehicle.model';
import { Gondola } from '../../models/gondola.model';
import { GondolaService, VehicleService, UserService, MechanicService, MaintenanceService } from '../../services/service.index';
import { Basics } from 'src/app/models/basics.model';
import { User } from 'src/app/models/user.model';
import { Mechanic } from '../../models/mech.model';
import { Maintenance } from '../../models/maintenance.model';

declare var swal: any;
declare function init_step();

@Component({
  selector: 'app-maintenance',
  templateUrl: './maintenance.component.html',
  styles: []
})
export class MaintenanceComponent implements OnInit, AfterViewInit {
  @ViewChild('selectM') selectM: ElementRef;
  public loading = false;

  // Listado principal
  vehicles: Vehicle[] = [];
  gondolas: Gondola[] = [];
  mecanicos: Mechanic[] = []; // Arreglo sirve para llenar SELECT
  mechanics: Mechanic[] = []; // Arreglo del mantenimiento

  // Info principal
  icon: string = 'fas fa-info-circle';
  title: string = 'Información';
  type: string = '';
  info: string = 'Selecciona un vehículo para comenzar';
  selected: boolean = false;
  isTruckG: boolean = false;
  isGondola: boolean = false;
  usuario: User;

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
    public vehicleS: VehicleService,
    public userS: UserService,
    public mechS: MechanicService,
    public maintenanceS: MaintenanceService
  ) { }

  // Inicializar Mantenimiento
  mantenimiento: Maintenance = {
    _user: null,
    _vehicle: null,
    _gondola: null,
    dateStart: new Date()
  };

  ngOnInit() {
    this.cargarVehiculos();
    this.cargarGondolas();
    this.cargarMecanicos();
    this.usuario = this.userS.usuario;
  }

  ngAfterViewInit(): void {
    init_step();
  }

  /* #region  MECÁNICOS */

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
    console.log(this.mechanics);
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
      this.mantenimiento._mech = this.mechanics;
    }

  }

  deleteMech( id: string ) {
    console.log('BORRANDO...');
    console.log(this.mechanics);
    // BUSCAMOS EL INDEX en el que se encuentra el item a editar dentro del arreglo de basics
    const index = this.mechanics.findIndex(item => item._id === id);

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar un mecánico del mantenimiento',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {
      if (borrar) {
        // BUSCAMOS LA FILA DENTRO DEL ARREGLO PARA TENER LOS DATOS
        const row = this.mechanics.find(e => e._id === id);
        // ELIMINAMOS EL DETALLE en base al index encontrado
        this.mechanics.splice(index, 1);
      }
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
        if (resp.length === 0) {
          this.mantenimiento = {
            _user: null,
            _vehicle: null,
            _gondola: null,
            dateStart: new Date(),
            dateEnd: null,
            _mech: []
          };
          this.mechanics = this.mantenimiento._mech;
        } else {
          this.mantenimiento = resp.mantenimiento;
        }
        console.log(this.mantenimiento);
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
