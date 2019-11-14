import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { DatatablesService, VehicleService, UserService, AutoProviderService, BuySpareService } from 'src/app/services/service.index';
import { Gas } from '../../models/gas.model';
import * as $ from 'jquery';
import * as moment from 'moment/moment';
import { AutoProvider } from '../../models/autoProvider.model';
import { BuySpare } from '../../models/buySpare.model';

// declare function init_datatables();
// declare function destroy_datatables();
declare function init_reports();
declare function init_reports2();
declare var swal: any;

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: []
})
export class ReportsComponent implements OnInit, AfterViewInit {

  loading: boolean = false;
  @ViewChild('dateG1') dateG1: ElementRef;
  @ViewChild('dateG2') dateG2: ElementRef;
  @ViewChild('dateP1') dateP1: ElementRef;
  @ViewChild('dateP2') dateP2: ElementRef;
  @ViewChild('selectP') selectP: ElementRef;

  gasolines: Gas[] = [];
  totalGas = 0.00;
  totalGal = 0.00;
  autoProviders: AutoProvider[] = [];
  buySpares: BuySpare[] = [];
  totalB = 0.00;
  totalDiscountB = 0.00;

  today: Date;
  date1Consulta = '';
  date2Consulta = '';
  nombreSelect = '';

  constructor(
    public dtService: DatatablesService,
    private chRef: ChangeDetectorRef,
    public userS: UserService,
    public vehicleS: VehicleService,
    public autoProviderS: AutoProviderService,
    public buySpareS: BuySpareService
  ) { }

  ngOnInit() {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);

    this.autoProviderS.cargarProveedores()
      .subscribe((resp: any) => this.autoProviders = resp.proveedores);
  }

  ngAfterViewInit() {
    $('.select2').select2();
  }

  /* #region  COMPRAS / PROVEEDOR */

  createReportB() {
    this.today = new Date();
    this.chRef.detectChanges();
    init_reports2();
  }

  searchB() {

    if (!this.selectP.nativeElement.value || !this.dateP1.nativeElement.value || !this.dateP2.nativeElement.value) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    this.loading = true;
    const _id = this.selectP.nativeElement.value;
    const fecha1 = moment(this.dateP1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.dateP2.nativeElement.value, 'DD/MM/YYYY').toDate();
    // BUSCAMOS LA FILA DENTRO DEL ARREGLO PARA TENER EL NOMBRE DEL TIPO SELECCIONADO
    const row = this.autoProviders.find(e => e._id === this.selectP.nativeElement.value);
    this.nombreSelect = row.name;

    this.buySpareS.cargarComprasProvider(_id, fecha1, fecha2).subscribe(resp => {
      // destroy_datatables();
      this.buySpares = resp;
      // console.log(this.buySpares);
      this.totalsB();
      this.date1Consulta = this.dateP1.nativeElement.value;
      this.date2Consulta = this.dateP2.nativeElement.value;

      // this.chRef.detectChanges();
      // init_datatables();
      this.loading = false;
    });
  }

  totalsB() {
    // SUMAS PARA LOS TOTAL DE GASOLINA Y GALONES CONSUMIDOS -------------
    this.totalB = this.buySpares.reduce((sum, item) => sum + item.total, 0);
    this.totalDiscountB = this.buySpares.reduce((sum, item) => sum + item.discount, 0);
  }
  /* #endregion */

  /* #region  COMBUSTIBLE */
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
      // destroy_datatables();
      this.gasolines = resp;
      // console.log(this.gasolines);
      this.totalsG();
      this.date1Consulta = this.dateG1.nativeElement.value;
      this.date2Consulta = this.dateG2.nativeElement.value;
      // this.chRef.detectChanges();
      // init_datatables();
      this.loading = false;
    });
  }

  totalsG() {
    // SUMAS PARA LOS TOTAL DE GASOLINA Y GALONES CONSUMIDOS -------------
    this.totalGas = this.gasolines.reduce((sum, item) => sum + item.total, 0);
    this.totalGal = this.gasolines.reduce((sum, item) => sum + item.gallons, 0);
  }
  /* #endregion */

}
