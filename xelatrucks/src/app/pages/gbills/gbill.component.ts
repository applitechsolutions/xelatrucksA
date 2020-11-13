import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatatablesService, GbillService, CPcustomerService, TripService, TypeTripService } from '../../services/service.index';
import { GreenBill } from '../../models/gbill.model';
import { DetailBill } from '../../models/gdetail.model';
import { PreDetailBill } from '../../models/gpredetail.model';
import { CPCustomer } from '../../models/CPcustomer.model';
import { Type } from '../../models/type.model';
import { Tariff } from '../../models/tariff.model';
import swal from 'sweetalert';
import * as $ from 'jquery';
import * as moment from 'moment/moment';
import '../../../assets/vendor/select2/js/select2.js';

declare function init_datatables();
declare function destroy_datatables();

@Component({
  selector: 'app-gbill',
  templateUrl: './gbill.component.html',
  styles: []
})
export class GbillComponent implements OnInit, AfterViewInit {

  @ViewChild('date1') date1: ElementRef;
  @ViewChild('date2') date2: ElementRef;
  @ViewChild('selectC') selectC: ElementRef;
  @ViewChild('selectTT') selectTT: ElementRef;
  @ViewChild('extra') extra: ElementRef;

  formGB: FormGroup;
  greenbil: GreenBill = { _customer: null, noBill: '', serie: '', date: null, total: 0, state: false, paid: false };
  preDetail: PreDetailBill = { code: '', prod: '', totalmts: 0, trips: 0 };
  preDetails: any[] = [];
  details: DetailBill[] = [];
  tarifa: number = 0;
  loading: boolean = false;

  cpcustomers: CPCustomer[] = [];
  types: Type[] = [];
  tarifas: Tariff[] = [];

  // NUEVAS VARIABLES
  TOTALVIAJES = 0;
  TOTALMTRS = 0;

  // greenTrip para editar
  tripTemp = null;

  constructor(
    public router: Router,
    public gbillService: GbillService,
    public cpService: CPcustomerService,
    public dtService: DatatablesService,
    public tripService: TripService,
    public typeService: TypeTripService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);

    this.cargarCPClientes();
    this.cargarTypeTrips();

    this.formGB = new FormGroup({
      customer: new FormControl('')
    });
  }

  ngAfterViewInit() {
    $('.select2').select2();
  }

  /* #region  FACTURA REPORTE CUADROS */

  calcularTotales() {
    this.TOTALVIAJES = this.preDetails.reduce((sum, item) => sum + item.totalTrips, 0);
    this.TOTALMTRS = this.preDetails.reduce((sum, item) => sum + item.totalmts, 0);

    this.preDetails.forEach(item => {
      this.preDetail.code = item.code;
      this.preDetail.prod = item.prod;
      this.preDetail.totalmts += item.totalmts;
      this.preDetail.trips += item.trips;
    });
  }

  generarPreDetalle() {

    const fecha1 = moment(this.date1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.date2.nativeElement.value, 'DD/MM/YYYY').toDate();
    const idTipo = this.selectTT.nativeElement.value;
    const extra = this.extra.nativeElement.value;

    if (fecha1 > fecha2 || idTipo === '') {
      swal('Oops...', 'Debe llenar todos los campos o los valores no son válidos', 'warning');
      return;
    }
    this.loading = true;
    this.gbillService.cargarPreDetalle(idTipo, fecha1, fecha2)
      .subscribe((res: any) => {

        if (res.preDetail.length <= 0) {
          swal('Oops...', 'No hay viajes para facturar en ese rango de fechas', 'warning');
          this.details = [];
          this.loading = false;
          return;
        }
        destroy_datatables();
        this.preDetails = res.preDetail;

        // CALCULAMOS EL TOTAL DE VIAJES Y DE METROS DE TODAS LAS FECHAS
        this.calcularTotales();
        // BUSCAMOS EL TARIFARIO DENTRO DEL TIPO DE PRODUCCION
        const row = this.types.find(e => e._id === this.selectTT.nativeElement.value);

        this.tarifas = row.tariff;
        if (extra <= 0 || extra === '') {
          this.tarifas.forEach(element => {
            if (this.TOTALMTRS >= element.start && this.TOTALMTRS <= element.end) {
              this.tarifa = (element.cost * 1.12);
            }
          });
        } else {
          this.tarifa = (extra * 1.12);
        }
        this.chRef.detectChanges();
        init_datatables();


        this.loading = false;
      }, error => {
        this.loading = false;
      });
  }

  addBillDetails() {
    this.preDetails.forEach(detail => {
      this.details.push({
        date: detail._id,
        _type: {
          code: detail.code,
          name: detail.prod,
          km: 0,
          tariff: [],
          _id: detail._type
        },
        details: detail.detalles,
        mts: detail.totalmts,
        trips: detail.totalTrips,
        cost: this.tarifa,
      });
    });
    this.preDetails = [];
    this.calcularTotales();
  }

  totalsFactura() {
    let billTotals = {
      trips: 0,
      mts: 0,
      total: 0
    };
     billTotals.trips = this.details.reduce((sum, item) => sum + item.trips, 0)
     billTotals.mts = this.details.reduce((sum, item) => sum + item.mts, 0)
     billTotals.total = this.details.reduce((sum, item) => sum + (item.mts * item.cost), 0)
     return billTotals;
  }

  crearFacturaVerde() {

    this.formGB.value.customer = this.selectC.nativeElement.value;

    if (this.formGB.invalid || this.selectC.nativeElement.value === '') {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    if (this.details.length <= 0) {
      swal('Oops...', 'El detalle esta vacío', 'warning');
      return;
    }

    let greenbill;
    this.loading = true;

    if (this.greenbil._id) {
      return;
    } else {
      greenbill = new GreenBill(
        this.formGB.value.customer,
        '',
        '',
        null,
        this.totalsFactura().total,
        false,
        false,
        '',
        '',
        this.details
      );
    }

    this.gbillService.crearFacturaVerde(greenbill)
      .subscribe(() => this.router.navigate(['/gbills']));
  }

  cargarCPClientes() {
    this.cpService.cargarClientes()
      .subscribe((res: any) => {
        this.cpcustomers = res.clientes;
      });
  }

  cargarTypeTrips() {
    this.typeService.cargarTypes()
      .subscribe((res: any) => {
        this.types = res.viajes;
      });
  }

  editar(_id) {
    this.tripTemp = _id;
  }

  recibirGreenTrip(event){
    this.generarPreDetalle();
  }


  /* #endregion */

}
