import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Employee } from '../../models/employee.model';
import { Vehicle } from '../../models/vehicle.model';
import { Type } from '../../models/type.model';
import { Material } from '../../models/material.model';
import { EmployeeService, VehicleService, MaterialService, TripService, DatatablesService } from '../../services/service.index';
import * as $ from 'jquery';
import * as moment from 'moment/moment';
import '../../../assets/vendor/select2/js/select2.js';
import { GreenTrip } from '../../models/greenTrip.model';

declare var swal: any;
declare function init_datatables();
declare function destroy_datatables();

@Component({
  selector: 'app-gtrips',
  templateUrl: './gtrips.component.html',
  styles: []
})
export class GtripsComponent implements OnInit, AfterViewInit {

  loading: boolean = false;
  @ViewChild('date1') date1: ElementRef;
  @ViewChild('date2') date2: ElementRef;

  @ViewChild('closeMTy') closeMty: ElementRef;
  @ViewChild('closeMMt') closeMMt: ElementRef;
  @ViewChild('selectE') selectE: ElementRef;
  @ViewChild('selectT') selectT: ElementRef;
  @ViewChild('selectV') selectV: ElementRef;
  @ViewChild('selectM') selectM: ElementRef;

  formGT: FormGroup;
  greenTrip: GreenTrip = { _employee: null, _type: null, _vehicle: null, _material: null };
  greenTrips: GreenTrip[] = [];
  todayGT: GreenTrip[] = [];

  employees: Employee[] = [];
  vehicles: Vehicle[] = [];
  vehicle: Vehicle;

  types: Type[] = [];
  type: Type = {};
  formTy: FormGroup;
  tempType: string = '';

  materials: Material[] = [];
  material: Material = { code: '', name: '', minStock: 0 };
  formMat: FormGroup;
  tempMat: string = '';


  constructor(
    public empService: EmployeeService,
    public vehicleService: VehicleService,
    public tripService: TripService,
    public matService: MaterialService,
    public dtService: DatatablesService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit() {

    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);
    this.dtService.init_datePicker2();

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

    this.formTy = new FormGroup({
      name: new FormControl(null, Validators.required),
      km: new FormControl(null, Validators.required),
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

  /* #region  CREAR Reporte Cuadros */

  crearViajeVerde() {

    this.formGT.value.employee = this.selectE.nativeElement.value;
    this.formGT.value.material = this.selectM.nativeElement.value;

    let type: Type;

    this.vehicle = this.vehicles.find(v => v._id === this.selectV.nativeElement.value);
    type = this.types.find(ty => ty._id === this.selectT.nativeElement.value);

    console.log(this.formGT.value);
    console.log(this.formGT.valid);

    if (this.formGT.invalid) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    let greenT;

    if (this.greenTrip._id) {
      greenT = new GreenTrip(
        this.formGT.value.employee,
        type,
        this.vehicle,
        this.formGT.value.material,
        moment(this.formGT.value.date, 'DD/MM/YYYY').toDate(),
        moment(this.formGT.value.checkIN, 'DD/MM/YYYY').toDate(),
        moment(this.formGT.value.checkOUT, 'DD/MM/YYYY').toDate(),
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
        moment(this.formGT.value.checkIN, 'DD/MM/YYYY hh:mm').toDate(),
        moment(this.formGT.value.checkOUT, 'DD/MM/YYYY hh:mm').toDate(),
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
      });
  }

  borrarGreenTrip( trip: GreenTrip ) {

    console.log(trip);

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar el viaje del camión ' + trip._vehicle.plate,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {
      if (borrar) {

        this.tripService.borrarGreenTrip( trip )
          .subscribe( (borrado: any) => {
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

  cargarEmpleados() {
    this.empService.cargarEmpleados()
      .subscribe((res: any) => this.employees = res.empleados);
  }

  cargarVehiculos() {
    this.vehicleService.cargarVehiculos()
      .subscribe((res: any) => this.vehicles = res.vehiculos);
  }

  cargarTypes() {
    this.tripService.cargarTypes()
      .subscribe((res: any) => this.types = res.viajes);
  }

  cargarMateriales() {
    this.matService.cargarMateriales()
      .subscribe((res: any) => this.materials = res.materiales);
  }

  crearTipoViaje() {
    console.log(this.formTy.value);
    console.log(this.formTy.valid);

    if (this.formTy.invalid) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }


    let type;

    if (this.type._id) {
      type = new Type(
        this.formTy.value.name,
        this.formTy.value.km,
        this.type._id
      );
    } else {
      type = new Type(
        this.formTy.value.name,
        this.formTy.value.km
      );
    }

    this.tripService.crearTypes(type)
      .subscribe((res: any) => {
        console.log(res);
        swal({
          title: 'Exito!',
          text: 'Viaje creado correctamente' + res.viaje.name,
          icon: 'success',
          button: false,
          timer: 1000
        });
        this.tempType = res.viaje._id;
        this.formTy.reset();
        this.closeMty.nativeElement.click();
        this.cargarTypes();
      });

  }

  crearMaterial() {
    console.log(this.formMat.value);
    console.log(this.formMat.valid);

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


  /* #region  LISTAR Reporte Cuadros */

  buscarReporteCuadros() {
    this.loading = true;
    const fecha1 = moment(this.date1.nativeElement.value, 'DD/MM/YYYY hh:mm').toDate();
    const fecha2 = moment(this.date2.nativeElement.value, 'DD/MM/YYYY hh:mm').toDate();

    this.tripService.cargarGreenTrips( fecha1, fecha2 )
    .subscribe((res: any) => {
        destroy_datatables();
        this.greenTrips = res.viajesV;
        this.loading = false;
        this.chRef.detectChanges();
        init_datatables();

      });
  }
  /* #endregion */



}
