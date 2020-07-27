import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { DatatablesService, UserService, VehicleService } from 'src/app/services/service.index';

import * as $ from 'jquery';
import * as moment from 'moment/moment';

declare function init_datatables();
declare function destroy_datatables();
declare function init_reports();
declare var swal: any;

@Component({
  selector: 'app-gas-consumptions',
  templateUrl: './gas-consumptions.component.html',
  styles: [
  ]
})
export class GasConsumptionsComponent implements OnInit, AfterViewInit {

  loading: boolean = false;
  @ViewChild('date1') date1: ElementRef;
  @ViewChild('date2') date2: ElementRef;

  gasolines: any[] = [];
  totalGas = 0.00;
  totalGal = 0.00;

  today: Date;
  titulo = 'Consumo de combustible';
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
  }

  ngAfterViewInit() {
    $('.select2').select2();
  }

  createReport() {
    this.today = new Date();
    this.chRef.detectChanges();
    init_reports();
  }

  search() {

    if (!this.date1.nativeElement.value || !this.date2.nativeElement.value) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    this.loading = true;
    const fecha1 = moment(this.date1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.date2.nativeElement.value, 'DD/MM/YYYY').toDate();
    this.subTitulo = this.date1.nativeElement.value + ' - ' + this.date2.nativeElement.value;

    this.vehicleS.cargarGasolinesAll(fecha1, fecha2).subscribe((resp: any) => {
      destroy_datatables();
      this.gasolines = resp;
      // console.log(this.gasolines);
      this.totalsG();
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
