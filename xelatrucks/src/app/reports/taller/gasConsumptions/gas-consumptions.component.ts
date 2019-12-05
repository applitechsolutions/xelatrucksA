import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { DatatablesService, UserService, VehicleService } from 'src/app/services/service.index';
import { Gas } from 'src/app/models/gas.model';

import * as $ from 'jquery';
import * as moment from 'moment/moment';

declare function init_datatables();
declare function destroy_datatables();
declare function init_reports();
declare var swal: any;

@Component({
  selector: 'app-gas-consumptions',
  templateUrl: './gas-consumptions.component.html',
  styles: []
})
export class GasConsumptionsComponent implements OnInit, AfterViewInit {

  loading: boolean = false;
  @ViewChild('dateG1', { static: false }) dateG1: ElementRef;
  @ViewChild('dateG2', { static: false }) dateG2: ElementRef;

  gasolines: Gas[] = [];
  totalGas = 0.00;
  totalGal = 0.00;

  today: Date;
  date1Consulta = '';
  date2Consulta = '';
  nombreSelect = '';

  constructor(
    public dtService: DatatablesService,
    private chRef: ChangeDetectorRef,
    public userS: UserService,
    public vehicleS: VehicleService
  ) { }

  ngOnInit() {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);
  }

  ngAfterViewInit() {
    $('.select2').select2();
  }

  createReportG() {
    this.today = new Date();
    this.chRef.detectChanges();
    init_reports();
  }

  searchG() {

    if (!this.dateG1.nativeElement.value || !this.dateG2.nativeElement.value) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    this.loading = true;
    const fecha1 = moment(this.dateG1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.dateG2.nativeElement.value, 'DD/MM/YYYY').toDate();

    this.vehicleS.cargarGasolinesAll(fecha1, fecha2).subscribe(resp => {
      destroy_datatables();
      this.gasolines = resp;
      // console.log(this.gasolines);
      this.totalsG();
      this.date1Consulta = this.dateG1.nativeElement.value;
      this.date2Consulta = this.dateG2.nativeElement.value;
      this.chRef.detectChanges();
      init_datatables();
      this.loading = false;
    });
  }

  totalsG() {
    // SUMAS PARA LOS TOTAL DE GASOLINA Y GALONES CONSUMIDOS -------------
    this.totalGas = this.gasolines.reduce((sum, item) => sum + item.total, 0);
    this.totalGal = this.gasolines.reduce((sum, item) => sum + item.gallons, 0);
  }

}
