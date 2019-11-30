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

  @ViewChild('closeMMt', { static: false }) closeMMt: ElementRef;
  @ViewChild('selectE', { static: false }) selectE: ElementRef;
  @ViewChild('selectT', { static: false }) selectT: ElementRef;
  @ViewChild('selectV', { static: false }) selectV: ElementRef;
  @ViewChild('selectM', { static: false }) selectM: ElementRef;

  formGT: FormGroup;
  greenTrip: GreenTrip = { _employee: null, _type: null, _vehicle: null, _material: null };
  greenTrips: GreenTrip[] = [];
  todayGT: GreenTrip[] = [];

  employees: Employee[] = [];
  vehicles: Vehicle[] = [];
  vehicle: Vehicle;

  types: Type[] = [];

  formTy: FormGroup;
  tempType: string = '';

  materials: StorageMaterial[] = [];
  material: Material = { code: '', name: '', minStock: 0 };
  formMat: FormGroup;
  tempMat: string = '';

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
  ) { }

  ngOnInit() {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);
    this.dtService.init_timePicker();

    this.cargarEmpleados();
    this.cargarVehiculos();
    this.cargarTypes();
    this.cargarMateriales();

    this.formGT = new FormGroup({
      employee: new FormControl(''),
      type: new FormControl(''),
      vehicle: new FormControl(''),
      material: new FormControl(''),
      date: new FormControl(null),
      checkIN: new FormControl(null),
      checkOUT: new FormControl(null),
      trips: new FormControl(null),
      details: new FormControl(null)
    });

    this.formMat = new FormGroup({
      code: new FormControl(null),
      name: new FormControl(null, Validators.required),
      minStock: new FormControl(null, Validators.required)
    });
  }

  ngAfterViewInit() {
    $('.select2').select2();
  }

  cargarViajeVerde(id: string) {

    this.tripService.cargarGreenTrip(id)
      .subscribe((res: any) => {
        this.greenTrip = res.Gviaje;
      });
  }

  /* #region  CREAR VIAJE VERDE */

  crearViajeVerde() {

    this.formGT.value.employee = this.selectE.nativeElement.value;
    this.formGT.value.material = this.selectM.nativeElement.value;

    let type: Type;

    this.vehicle = this.vehicles.find(v => v._id === this.selectV.nativeElement.value);
    type = this.types.find(ty => ty._id === this.selectT.nativeElement.value);

    // tslint:disable-next-line: max-line-length
    if (this.formGT.invalid || this.selectV.nativeElement.value === '' || this.selectT.nativeElement.value === '' || this.selectE.nativeElement.value === '' || this.selectM.nativeElement.value === '') {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    this.loading = true;
    let greenT;

    if (this.greenTrip._id) {
      greenT = new GreenTrip(
        this.formGT.value.employee,
        type,
        this.vehicle,
        this.formGT.value.material,
        moment(this.formGT.value.date, 'DD/MM/YYYY').toDate(),
        moment(this.formGT.value.checkIN, 'HH:mm').toDate(),
        moment(this.formGT.value.checkOUT, 'HH:mm').toDate(),
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
        moment(this.formGT.value.checkIN, 'HH:mm').toDate(),
        moment(this.formGT.value.checkOUT, 'HH:mm').toDate(),
        this.formGT.value.trips,
        this.formGT.value.details
      );
    }

    this.tripService.crearGreenTrip(greenT)
      .subscribe((res: any) => {

        swal({
          title: 'Exito!',
          text: 'Viaje creado correctamente' + res.viajeV.details,
          icon: 'success',
          button: false,
          timer: 1500
        });

        this.formGT.reset();
        $('.select2').val('').trigger('change');
        this.todayGT.push({
          _employee: res.viajeV._employee,
          _type: res.viajeV._type,
          _vehicle: res.viajeV._vehicle,
          _material: res.viajeV._material,
          date: res.viajeV.date,
          checkIN: res.viajeV.checkIN,
          checkOUT: res.viajeV.checkOUT,
          trips: res.viajeV.trips,
          details: res.viajeV.details,
          _id: res.viajeV._id
        });
        this.loading = false;
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
        console.log(this.materials);
      });
  }

  crearMaterial() {

    if (this.formMat.invalid) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    let material;

    if (this.material._id) {
      material = new Material(
        this.formMat.value.code,
        this.formMat.value.name,
        this.formMat.value.minStock,
        this.material._id
      );
    } else {
      material = new Material(
        this.formMat.value.code,
        this.formMat.value.name,
        this.formMat.value.minStock
      );
    }

    this.matService.crearMaterial(material)
      .subscribe((res: any) => {
        swal({
          title: 'Exito!',
          text: 'Material creado correctamente' + res.material.code + ' ' + res.material.name,
          icon: 'success',
          button: false,
          timer: 1500
        });

        this.tempMat = res.material._id;
        this.formMat.reset();
        this.closeMMt.nativeElement.click();
        this.cargarMateriales();

      });

  }

  /* #endregion */

}
