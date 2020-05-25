import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PullService, DatatablesService, EmployeeService, VehicleService, TripService } from 'src/app/services/service.index';
import { Pull } from '../../models/pull.model';
import { Employee } from '../../models/employee.model';
import { Vehicle } from '../../models/vehicle.model';
import { WhiteTrip } from '../../models/whiteTrip.model';

import * as $ from 'jquery';
import * as moment from 'moment/moment';

declare var swal: any;
declare function init_datatables();
declare function destroy_datatables();

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styles: []
})
export class OrdersComponent implements OnInit, AfterViewInit {

  @ViewChild('selectE') selectE: ElementRef;
  @ViewChild('selectV') selectV: ElementRef;
  @ViewChild('closeM') closeM: ElementRef;
  @ViewChild('date') date: ElementRef;
  @ViewChild('checkIN') checkIN: ElementRef;
  @ViewChild('checkOUT') checkOUT: ElementRef;

  pulls: Pull[] = [];
  pull: Pull = {
    _order: {
      _destination: null,
      date: '',
      order: ''
    },
    _material: {
      code: '',
      name: '',
      minStock: 0
    },
    mts: 0,
    totalMts: 0,
    kg: 0,
    totalKg: 0
  };
  loading = false;

  employees: Employee[] = [];
  vehicles: Vehicle[] = [];

  formaTrip: FormGroup;

  whiteTrips: WhiteTrip[] = [];

  constructor(
    public pullS: PullService,
    public chRef: ChangeDetectorRef,
    public dtService: DatatablesService,
    public empService: EmployeeService,
    public vehicleService: VehicleService,
    public tripS: TripService
  ) { }

  ngOnInit() {

    this.formaTrip = new FormGroup({
      date: new FormControl(null, Validators.required),
      noTicket: new FormControl('', Validators.required),
      noDelivery: new FormControl(''),
      mts: new FormControl('', Validators.required),
      kgB: new FormControl('', Validators.required),
      kgT: new FormControl('', Validators.required),
      kgN: new FormControl('', Validators.required),
      checkIN: new FormControl(null, Validators.required),
      checkOUT: new FormControl(null, Validators.required),
      tariff: new FormControl('', Validators.required)
    });

    this.cargarPulls();
    this.cargarVehiculos();
    this.cargarEmpleados();
  }

  ngAfterViewInit() {
    $('.select2').select2();

    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);
    this.dtService.init_timePicker();
  }

  cargarPulls() {
    this.pullS.cargarActivas()
      .subscribe((resp: any) => {
        destroy_datatables();
        // console.log(resp);
        this.pulls = resp.pulls;
        this.chRef.detectChanges();
        init_datatables();
      });
  }

  finalizarPull(pull: Pull) {
    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de finalizar la entrega del material: ' + pull._material.code + ' ' + pull._material.name,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {

          this.pullS.finalizarPull(pull._id)
            .subscribe((borrado: any) => {
              destroy_datatables();
              this.cargarPulls();
            });
        }
      });
  }

  /* #region  Reportes */
  verReportes(pull: Pull) {

    this.loading = true;
    this.pull = pull;

    this.tripS.cargarWhiteTrips(this.pull._id)
      .subscribe((resp: any) => {
        this.dtService.destroy_table2();

        this.whiteTrips = resp.wviajes;

        this.chRef.detectChanges();
        this.dtService.init_tables2();
        this.loading = false;
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

  cargarReporte(pull: Pull) {
    this.pull = pull;
    this.formaTrip.get('tariff').setValue(this.pull._order._destination.tariff.toFixed(2));
  }

  crearReporte() {

    this.formaTrip.get('date').setValue(this.date.nativeElement.value);
    this.formaTrip.get('checkIN').setValue(this.checkIN.nativeElement.value);
    this.formaTrip.get('checkOUT').setValue(this.checkOUT.nativeElement.value);
    // console.log(this.formaTrip);

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
      moment(this.formaTrip.value.date, 'DD/MM/YYYY').toDate(),
      this.formaTrip.value.noTicket,
      this.formaTrip.value.mts,
      this.formaTrip.value.kgB,
      this.formaTrip.value.kgT,
      this.formaTrip.value.kgN,
      moment(this.formaTrip.value.checkIN, 'HH:mm').toDate(),
      moment(this.formaTrip.value.checkOUT, 'HH:mm').toDate(),
      this.formaTrip.value.tariff,
      false,
      this.formaTrip.value.noDelivery,
    );

    this.tripS.crearWhiteTrip(whiteTrip, this.pull._order._destination.km)
      .subscribe((res: any) => {
        swal({
          title: 'Exito!',
          text: 'Reporte creado correctamente ' + res.viajeB.noTicket,
          icon: 'success',
          button: false,
          timer: 1500
        });
        const today = moment(new Date()).format('DD/MM/YYYY');
        this.formaTrip.reset({
          date: today,
          noTicket: '',
          noDelivery: '',
          mts: '',
          kgB: '',
          kgT: '',
          kgN: '',
          checkIN: null,
          checkOUT: null,
          tariff: ''
        });
        this.dtService.init_timePicker();
        this.loading = false;
        this.closeM.nativeElement.click();
        this.cargarPulls();
      }, () => this.loading = false);


  }
  /* #endregion */

}
