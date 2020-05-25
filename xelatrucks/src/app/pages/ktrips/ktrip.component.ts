import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Employee } from 'src/app/models/employee.model';
import { Vehicle } from 'src/app/models/vehicle.model';
import { DestTank } from '../../models/destTank.model';
import { TankTrip } from '../../models/tankTrip.model';
import { DatatablesService, EmployeeService, VehicleService, DestTankService, TripService } from '../../services/service.index';
import * as $ from 'jquery';
import * as moment from 'moment/moment';
import '../../../assets/vendor/select2/js/select2.js';

declare var swal: any;
@Component({
  selector: 'app-ktrip',
  templateUrl: './ktrip.component.html',
  styles: []
})
export class KtripComponent implements OnInit {

  @ViewChild('selectE') selectE: ElementRef;
  @ViewChild('selectV') selectV: ElementRef;
  @ViewChild('selectD') selectD: ElementRef;
  @ViewChild('date') date: ElementRef;
  @ViewChild('checkIN') checkIN: ElementRef;
  @ViewChild('checkOUT') checkOUT: ElementRef;

  formC: FormGroup;
  tankTrip: TankTrip = {_employee: null, _vehicle: null, _destination: null, _id: ''};

  employees: Employee[] = [];
  tempEmp: string = '';

  vehicles: Vehicle[] = [];
  vehicle: Vehicle;
  tempVehicle: string = '';

  destinations: DestTank[] = [];
  destination: DestTank;
  tempDest: string = '';

  loading: boolean = false;

  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public tripService: TripService,
    public empService: EmployeeService,
    public vehicleService: VehicleService,
    public destService: DestTankService,
    public dtService: DatatablesService
  ) {
    activatedRoute.params.subscribe(params => {

      const id = params.id;

      if (id !== 'new') {
        this.cargarViajeCisterna(id);
      }

    });
  }

  ngOnInit() {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);
    this.dtService.init_timePicker();

    this.formC = new FormGroup({
      employee: new FormControl(''),
      vehicle: new FormControl(''),
      destination: new FormControl(''),
      date: new FormControl(''),
      checkIN: new FormControl(null),
      checkOUT: new FormControl(null),
      trips: new FormControl(0),
      tariff: new FormControl(0),
      details: new FormControl(null)
    });

    this.cargarEmpleados();
    this.cargarVehiculos();
    this.cargarDestinos();
  }

  ngAfterViewInit() {
    $('.select2').select2();
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);
    this.dtService.init_timePicker();
  }

  cargarViajeCisterna( id: string ) {
    this.tripService.cargarTankTrip(id)
      .subscribe((res: any) => {
        this.tankTrip = res.reporte;
        const fecha = this.dtService.fromJsonDate(this.tankTrip.date);
        const hora1 = this.dtService.fromJsonHour(this.tankTrip.checkIN);
        const hora2 = this.dtService.fromJsonHour(this.tankTrip.checkOUT);
        this.tempVehicle = res.reporte._vehicle;
        this.tempEmp = res.reporte._employee;
        this.tempDest = res.reporte._destination._id;
        this.formC.get('employee').setValue(this.tankTrip._employee);
        this.formC.get('vehicle').setValue(this.tankTrip._vehicle);
        this.formC.get('destination').setValue(this.tankTrip._destination._id);
        this.formC.get('date').setValue(fecha);
        this.formC.get('checkIN').setValue(hora1);
        this.formC.get('checkOUT').setValue(hora2);
        this.formC.get('trips').setValue(this.tankTrip.trips);
        this.formC.get('tariff').setValue(this.tankTrip.tariff);

        this.formC.controls.destination.disable();
        this.formC.controls.vehicle.disable();
      });
  }

  crearViajeCisterna() {
    
    // tslint:disable-next-line: max-line-length
    if (this.formC.invalid || this.selectV.nativeElement.value === '' || this.selectE.nativeElement.value === '' || this.selectD.nativeElement.value === '') {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    this.formC.value.employee = this.selectE.nativeElement.value;
    this.formC.value.vehicle = this.selectV.nativeElement.value;
    this.formC.value.destination = this.selectD.nativeElement.value;
    this.formC.value.date = this.date.nativeElement.value;
    this.formC.value.checkIN = this.checkIN.nativeElement.value;
    this.formC.value.checkOUT = this.checkOUT.nativeElement.value;

    const horaIn = this.formC.value.date + ' ' + this.formC.value.checkIN;
    const horaOut = this.formC.value.date + ' ' + this.formC.value.checkOUT;

    this.vehicle = this.vehicles.find(v => v._id === this.selectV.nativeElement.value);
    this.destination = this.destinations.find(dest => dest._id === this.selectD.nativeElement.value);
    let km;

    this.loading = true;
    let tankTrip;

    if (this.tankTrip._id) {
      
      if (this.tankTrip.trips === this.formC.value.trips) {
        km = 0;
      } else if (this.tankTrip.trips <= this.formC.value.trips) {
        km = (this.formC.value.trips * this.tankTrip._destination.km) - (this.tankTrip.trips * this.tankTrip._destination.km);
      } else if (this.tankTrip.trips >= this.formC.value.trips) {
        km = (this.tankTrip.trips * this.tankTrip._destination.km) - (this.formC.value.trips * this.tankTrip._destination.km);
        km = km * -1;
      }

      tankTrip = new TankTrip(
        this.formC.value.employee,
        this.vehicle,
        this.formC.value.destination,
        moment(this.formC.value.date, 'DD/MM/YYYY').toDate(),
        moment(horaIn, 'DD/MM/YYYY HH:mm').toDate(),
        moment(horaOut, 'DD/MM/YYYY HH:mm').toDate(),
        this.formC.value.trips,
        this.formC.value.tariff,
        this.tankTrip._id
      );
    } else {
      km = this.destination.km * this.formC.value.trips;
      tankTrip = new TankTrip(
        this.formC.value.employee,
        this.vehicle,
        this.formC.value.destination,
        moment(this.formC.value.date, 'DD/MM/YYYY').toDate(),
        moment(horaIn, 'DD/MM/YYYY HH:mm').toDate(),
        moment(horaOut, 'DD/MM/YYYY HH:mm').toDate(),
        this.formC.value.trips,
        this.formC.value.tariff,
      );
    }

    this.tripService.crearTankTrip(tankTrip, km)
      .subscribe((res: any) => {
        this.router.navigate(['/ktrips']);
      }, () => this.loading = false);

  }

  /* #region  LISTAR COLECCIONES */

  cargarEmpleados() {
    this.empService.cargarEmpleados()
      .subscribe((res: any) => this.employees = res.empleados);
  }

  cargarVehiculos() {
    this.vehicleService.cargarVehiculos()
      .subscribe((res: any) => this.vehicles = res.vehiculos);
  }

  cargarDestinos() {
    this.destService.cargarDestinos()
      .subscribe( (res: any) => this.destinations = res.destinos);
  }

  /* #endregion */

}
