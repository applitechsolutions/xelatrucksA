import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Employee } from '../../models/employee.model';
import { Vehicle } from '../../models/vehicle.model';
import { Type } from '../../models/type.model';
import { Material } from '../../models/material.model';
import { GreenTrip } from '../../models/greenTrip.model';
import { StorageMaterial } from '../../models/storageMaterial.model';
import {
  EmployeeService,
  VehicleService,
  MaterialService,
  TripService,
  TypeTripService,
  DatatablesService
} from '../../services/service.index';
import * as $ from 'jquery';
import * as moment from 'moment/moment';
import '../../../assets/vendor/select2/js/select2.js';

declare var swal: any;

@Component({
  selector: 'app-gtrip',
  templateUrl: './gtrip.component.html',
  styles: []
})
export class GtripComponent implements OnInit {

  @ViewChild('closeMMt') closeMMt: ElementRef;
  @ViewChild('selectE') selectE: ElementRef;
  @ViewChild('selectT') selectT: ElementRef;
  @ViewChild('selectV') selectV: ElementRef;
  @ViewChild('selectM') selectM: ElementRef;
  @ViewChild('date') date: ElementRef;
  @ViewChild('checkIN') checkIN: ElementRef;
  @ViewChild('checkOUT') checkOUT: ElementRef;

  formGT: FormGroup;
  greenTrip: GreenTrip = { _employee: null, _type: null, _vehicle: null, _material: null };
  greenTrips: GreenTrip[] = [];
  todayGT: GreenTrip[] = [];

  employees: Employee[] = [];
  tempEmp: string = '';

  vehicles: Vehicle[] = [];
  vehicle: Vehicle;
  tempVehicle: string = '';

  types: Type[] = [];
  formTy: FormGroup;
  tempType: string = '';

  materials: StorageMaterial[] = [];

  loading: boolean = false;

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public empService: EmployeeService,
    public vehicleService: VehicleService,
    public tripService: TripService,
    public matService: MaterialService,
    public typeService: TypeTripService,
    public dtService: DatatablesService
  ) {
    activatedRoute.params.subscribe(params => {

      const id = params.id;

      if (id !== 'new') {
        this.cargarViajeVerde(id);
      }

    });
  }

  ngOnInit() {

    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);
    this.dtService.init_timePicker();

    this.formGT = new FormGroup({
      employee: new FormControl(''),
      type: new FormControl(''),
      vehicle: new FormControl(''),
      material: new FormControl(''),
      date: new FormControl(''),
      checkIN: new FormControl(null),
      checkOUT: new FormControl(null),
      trips: new FormControl(null),
      details: new FormControl(null)
    });


    this.cargarEmpleados();
    this.cargarVehiculos();
    this.cargarTypes();
    this.cargarMateriales();
  }

  ngAfterViewInit() {
    $('.select2').select2();
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);
    this.dtService.init_timePicker();
  }

  cargarViajeVerde(id: string) {

    this.tripService.cargarGreenTrip(id)
      .subscribe((res: any) => {
        this.greenTrip = res.reporte;
        const fecha = this.dtService.fromJsonDate(this.greenTrip.date);
        const hora1 = this.dtService.fromJsonHour(this.greenTrip.checkIN);
        const hora2 = this.dtService.fromJsonHour(this.greenTrip.checkOUT);
        this.tempVehicle = res.reporte._vehicle._id;
        this.tempEmp = res.reporte._employee;
        this.tempType = res.reporte._type._id;
        this.tempMat = res.reporte._material;
        this.formGT.get('employee').setValue(this.greenTrip._employee);
        this.formGT.get('type').setValue(this.greenTrip._type._id);
        this.formGT.get('vehicle').setValue(this.greenTrip._vehicle._id);
        this.formGT.get('material').setValue(this.greenTrip._material);
        this.formGT.get('date').setValue(fecha);
        this.formGT.get('checkIN').setValue(hora1);
        this.formGT.get('checkOUT').setValue(hora2);
        this.formGT.get('trips').setValue(this.greenTrip.trips);
        this.formGT.get('details').setValue(this.greenTrip.details);

        this.formGT.controls.type.disable();
        this.formGT.controls.vehicle.disable();
      });
  }

  /* #region  CREAR VIAJE VERDE */

  crearViajeVerde() {

    this.formGT.value.date = this.date.nativeElement.value;
    this.formGT.value.checkIN = this.checkIN.nativeElement.value;
    this.formGT.value.checkOUT = this.checkOUT.nativeElement.value;

    // tslint:disable-next-line: max-line-length
    if (this.formGT.invalid || this.selectV.nativeElement.value === '' || this.selectT.nativeElement.value === '' || this.selectE.nativeElement.value === '' || this.selectM.nativeElement.value === '') {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }
    this.formGT.value.employee = this.selectE.nativeElement.value;
    this.formGT.value.material = this.selectM.nativeElement.value;
    const horaIn = this.formGT.value.date + ' ' + this.formGT.value.checkIN;
    const horaOut = this.formGT.value.date + ' ' + this.formGT.value.checkOUT;

    let type: Type;
    let diferencia;


    if (this.greenTrip.trips === this.formGT.value.trips) {
      diferencia = 0;
    } else if (this.greenTrip.trips <= this.formGT.value.trips) {
      diferencia = (this.formGT.value.trips * this.greenTrip._type.km) - (this.greenTrip.trips * this.greenTrip._type.km);
    } else if (this.greenTrip.trips >= this.formGT.value.trips) {
      diferencia = (this.greenTrip.trips * this.greenTrip._type.km) - (this.formGT.value.trips * this.greenTrip._type.km);
      diferencia = diferencia * -1;
    }

    this.vehicle = this.vehicles.find(v => v._id === this.selectV.nativeElement.value);
    type = this.types.find(ty => ty._id === this.selectT.nativeElement.value);


    this.loading = true;
    let greenT;

    if (this.greenTrip._id) {
      greenT = new GreenTrip(
        this.formGT.value.employee,
        type,
        this.vehicle,
        this.formGT.value.material,
        moment(this.formGT.value.date, 'DD/MM/YYYY').toDate(),
        moment(horaIn, 'DD/MM/YYYY HH:mm').toDate(),
        moment(horaOut, 'DD/MM/YYYY HH:mm').toDate(),
        this.formGT.value.trips,
        this.formGT.value.details,
        this.greenTrip._id
      );
    } else {
      greenT = new GreenTrip(
        this.formGT.value.employee,
        type,
        this.vehicle,
        this.formGT.value.material,
        moment(this.formGT.value.date, 'DD/MM/YYYY').toDate(),
        moment(horaIn, 'DD/MM/YYYY HH:mm').toDate(),
        moment(horaOut, 'DD/MM/YYYY HH:mm').toDate(),
        this.formGT.value.trips,
        this.formGT.value.details
      );
    }

    this.tripService.crearGreenTrip(greenT, diferencia)
      .subscribe((res: any) => {
        this.router.navigate(['/gtrips']);
      });
  }

  borrarGreenTrip(trip: GreenTrip) {

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar el viaje del camión ' + trip._vehicle.plate,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {

          this.tripService.borrarGreenTrip(trip)
            .subscribe((borrado: any) => {
              const index = this.todayGT.findIndex(item => item._id === borrado._id);
              this.todayGT.splice(index, 1);
              swal({
                title: 'Exito!',
                text: 'Viaje borrado correctamente',
                icon: 'success',
                button: false,
                timer: 1000
              });
            });
        }

      });
  }

  /* #endregion */

  /* #region  CARGAR DEMAS COLECCIONES */

  cargarEmpleados() {
    this.empService.cargarEmpleados()
      .subscribe((res: any) => this.employees = res.empleados);
  }

  cargarVehiculos() {
    this.vehicleService.cargarVehiculos()
      .subscribe((res: any) => this.vehicles = res.vehiculos);
  }

  cargarTypes() {
    this.typeService.cargarTypes()
      .subscribe((res: any) => this.types = res.viajes);
  }

  cargarMateriales() {
    this.matService.cargarMateriales()
      .subscribe((res: any) => {
        res.materiales
          .map((res: any) => {
            this.materials = res.storage;
          });
      });
  }

  recibirMaterial(material: Material) {
    console.log(material);
    this.cargarMateriales();
  }

  /* #endregion */

}
