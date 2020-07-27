import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { DatatablesService, UserService, VehicleService } from 'src/app/services/service.index';
import { Vehicle } from 'src/app/models/vehicle.model';
import { GreenTrip } from 'src/app/models/greenTrip.model';
import { WhiteTrip } from 'src/app/models/whiteTrip.model';

declare function init_datatables();
declare function destroy_datatables();
declare function init_datatables2();
declare function destroy_datatables2();
declare function init_reports();
declare var swal: any;

import * as $ from 'jquery';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-km-by-vehicles',
  templateUrl: './km-by-vehicles.component.html',
  styles: [
  ]
})
export class KmByVehiclesComponent implements OnInit, AfterViewInit {

  @ViewChild('date1') date1: ElementRef;
  @ViewChild('date2') date2: ElementRef;
  @ViewChild('selectV') selectV: ElementRef;
  loading: boolean = false;

  vehicles: Vehicle[] = [];
  greenTrips: GreenTrip[] = [];
  whiteTrips: WhiteTrip[] = [];
  greenTripsT = 0;
  greenKms = 0;
  whiteKms = 0;

  today: Date;
  titulo = '';
  subTitulo = '';

  constructor(
    public dtService: DatatablesService,
    private chRef: ChangeDetectorRef,
    public userS: UserService,
    public vehicleS: VehicleService
  ) { }

  ngOnInit(): void {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);

    this.cargarVehiculos();
  }

  ngAfterViewInit() {
    $('.select2').select2();
  }

  cargarVehiculos() {
    this.vehicleS.cargarVehiculos()
      .subscribe((resp: any) => this.vehicles = resp.vehiculos);
  }

  createReport() {
    this.today = new Date();
    this.chRef.detectChanges();
    init_reports();
  }

  search() {

    if (!this.selectV.nativeElement.value || !this.date1.nativeElement.value || !this.date2.nativeElement.value) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    this.loading = true;
    const _id = this.selectV.nativeElement.value;
    const fecha1 = moment(this.date1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.date2.nativeElement.value, 'DD/MM/YYYY').toDate();
    // BUSCAMOS LA FILA DENTRO DEL ARREGLO PARA TENER EL NOMBRE DEL TIPO SELECCIONADO
    const row = this.vehicles.find(e => e._id === this.selectV.nativeElement.value);
    let type = ' (Camión)';
    if (row.type === 'camionG') {
      type = ' (Camión Gondola)';
    }
    this.titulo = 'Viajes realizados por  ' + row.plate + type;
    this.subTitulo = this.date1.nativeElement.value + ' - ' + this.date2.nativeElement.value;

    this.vehicleS.cargarRptKmts(_id, fecha1, fecha2).subscribe((resp: any) => {
      destroy_datatables();
      destroy_datatables2();
      this.greenTrips = resp.greenTrips;
      this.whiteTrips = resp.whiteTrips;
      this.totals();

      this.chRef.detectChanges();
      init_datatables();
      init_datatables2();
      this.loading = false;
    });
  }

  totals() {
    // SUMAS PARA LOS TOTALES -------------
    this.greenTripsT = this.greenTrips.reduce((sum, item) => sum + item.trips, 0);
    this.greenKms = this.greenTrips.reduce((sum, item) => sum + (item.trips * item._type.km), 0);
    this.whiteKms = this.whiteTrips.reduce((sum, item) => sum + item._pull._order._destination.km, 0);
  }

}
