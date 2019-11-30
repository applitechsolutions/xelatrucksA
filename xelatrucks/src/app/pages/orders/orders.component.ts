import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { PullService, DatatablesService, EmployeeService, VehicleService } from 'src/app/services/service.index';
import { Pull } from '../../models/pull.model';
import { Employee } from '../../models/employee.model';
import { Vehicle } from '../../models/vehicle.model';

import * as $ from 'jquery';
import * as moment from 'moment/moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WhiteTrip } from '../../models/whiteTrip.model';

declare var swal: any;
declare function init_datatables();
declare function destroy_datatables();

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styles: []
})
export class OrdersComponent implements OnInit, AfterViewInit {

  @ViewChild('selectE', { static: false }) selectE: ElementRef;
  @ViewChild('selectV', { static: false }) selectV: ElementRef;

  pulls: Pull[] = [];
  pull: Pull = { _order: null, _material: null, mts: 0, totalMts: 0, kg: 0, totalKg: 0 };
  loading = false;

  employees: Employee[] = [];
  vehicles: Vehicle[] = [];

  formaTrip: FormGroup;

  constructor(
    public pullS: PullService,
    public chRef: ChangeDetectorRef,
    public dtService: DatatablesService,
    public empService: EmployeeService,
    public vehicleService: VehicleService
  ) { }

  ngOnInit() {
    this.pullS.cargarActivas()
      .subscribe((resp: any) => {
        destroy_datatables();
        // console.log(resp);
        this.pulls = resp.pulls;
        this.chRef.detectChanges();
        init_datatables();
      });

    this.formaTrip = new FormGroup({
      _employee: new FormControl('', Validators.required),
      _vehicle: new FormControl('', Validators.required),
      date: new FormControl(null, Validators.required),
      noTicket: new FormControl('', Validators.required),
      noDelivery: new FormControl('', Validators.required),
      mts: new FormControl('', Validators.required),
      kgB: new FormControl('', Validators.required),
      kgT: new FormControl('', Validators.required),
      kgN: new FormControl('', Validators.required),
      checkIN: new FormControl(null, Validators.required),
      checkOUT: new FormControl(null, Validators.required)
    });

    this.cargarVehiculos();
    this.cargarEmpleados();
  }

  ngAfterViewInit() {
    $('.select2').select2();

    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);
    this.dtService.init_timePicker();
  }

  cargarEmpleados() {
    this.empService.cargarEmpleados()
      .subscribe((res: any) => this.employees = res.empleados);
  }

  cargarVehiculos() {
    this.vehicleService.cargarVehiculos()
      .subscribe((res: any) => this.vehicles = res.vehiculos);
  }

  cargarReporte(pull: Pull) {
    this.pull = pull;
  }

  crearReporte() {

    if (this.formaTrip.invalid || this.selectE.nativeElement.value === '' || this.selectV.nativeElement.value === '') {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    this.loading = true;
    const employee = this.employees.find(e => e._id === this.selectE.nativeElement.value);
    const vehicle = this.vehicles.find(e => e._id === this.selectV.nativeElement.value);

    const whiteTrip = new WhiteTrip(
      employee,
      vehicle,
      this.pull,
      this.formaTrip.value.date,
      this.formaTrip.value.noTicket,
      this.formaTrip.value.noDelivery,
      this.formaTrip.value.mts,
      this.formaTrip.value.kgB,
      this.formaTrip.value.kgT,
      this.formaTrip.value.kgN,
      this.formaTrip.value.checkIN,
      this.formaTrip.value.checkOUT,
      false
    )

    const today = moment(new Date()).format('DD/MM/YYYY');

    this.formaTrip.reset({
      date: today
    });
    this.dtService.init_timePicker();
  }

}
