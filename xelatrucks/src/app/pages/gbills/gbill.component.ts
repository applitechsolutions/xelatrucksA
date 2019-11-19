import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DatatablesService, GbillService, CPcustomerService, TripService } from '../../services/service.index';
import { GreenBill } from '../../models/gbill.model';
import { DetailBill } from '../../models/gdetail.model';
import { PreDetailBill } from '../../models/gpredetail.model';
import { CPCustomer } from '../../models/CPcustomer.model';
import { Type } from '../../models/type.model';
import { Tariff } from '../../models/tariff.model';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';
import * as $ from 'jquery';
import * as moment from 'moment/moment';
import '../../../assets/vendor/select2/js/select2.js';

@Component({
  selector: 'app-gbill',
  templateUrl: './gbill.component.html',
  styles: []
})
export class GbillComponent implements OnInit, AfterViewInit {

  @ViewChild('date1', { static: false }) date1: ElementRef;
  @ViewChild('date2', { static: false }) date2: ElementRef;
  @ViewChild('selectC', { static: false }) selectC: ElementRef;
  @ViewChild('selectTT', { static: false }) selectTT: ElementRef;
  @ViewChild('extra', { static: false }) extra: ElementRef;
  @ViewChild('date1', {static: false}) date1: ElementRef;
  @ViewChild('date2', {static: false}) date2: ElementRef;
  @ViewChild('selectC', {static: false}) selectC: ElementRef;

  formGB: FormGroup;

  greenbil: GreenBill = { _customer: null, noBill: '', serie: '', date: null, total: 0, state: false, paid: false };
  preDetail: PreDetailBill = {code: '', prod: '', totalmts: 0, trips: 0};
  details: DetailBill[] = [];
  total: number = 0;
  loading: boolean = false;

  cpcustomers: CPCustomer[] = [];
  types: Type[] = [];
  tarifas: Tariff[] = [];

  constructor(
    public router: Router,
    public gbillService: GbillService,
    public cpService: CPcustomerService,
    public dtService: DatatablesService,
    public tripService: TripService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);
    this.dtService.init_datePicker2();

    this.cargarCPClientes();
    this.cargarTypeTrips();

    this.formGB = new FormGroup({
      customer: new FormControl(''),
      date: new FormControl(null, Validators.required)
    });
  }

  ngAfterViewInit() {
    $('.select2').select2();
  }

  /* #region  FACTURA REPORTE CUADROS */

  generarPreDetalle() {

    this.loading = true;

    const fecha1 = moment(this.date1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.date2.nativeElement.value, 'DD/MM/YYYY').toDate();
    const idTipo = this.selectTT.nativeElement.value;
    const extra = this.extra.nativeElement.value;
    let costo;

    if (fecha1 > fecha2 || idTipo === '') {
      swal('Oops...', 'Debe llenar todos los campos o los valores no son válidos', 'warning');
      return;
    }
    this.loading = true;
    this.gbillService.cargarPreDetalle(idTipo, fecha1, fecha2)
      .subscribe((res: any) => {

        if (res.preDetail.length <= 0) {
          swal('Oops...', 'No hay viajes en ese rango de fechas', 'warning');
          this.details = [];
          return;
        }
        this.preDetail = res.preDetail[0];
        this.tarifas = this.preDetail.tariff;
        this.details = [];
        if (extra <= 0 || extra === '') {
          this.tarifas.forEach(element => {
            if ( this.preDetail.totalmts >= element.start && this.preDetail.totalmts <= element.end ) {
              costo = this.preDetail.totalmts * (element.cost * 1.12);
              this.total = costo;
              this.details.push({
                _type: {
                  code: this.preDetail.code,
                  name: this.preDetail.prod,
                  km: 0,
                  tariff: null,
                  _id: this.preDetail._id
                },
                mts: this.preDetail.totalmts,
                trips: this.preDetail.trips,
                cost: costo
              })
            }
          });
        } else {
          costo = this.preDetail.totalmts * (extra * 1.12);
          this.total = costo;
          this.details.push({
            _type: {
              code: '',
              name: '',
              km: 0,
              tariff: null,
              _id: this.preDetail._id
            },
            mts: this.preDetail.totalmts,
            trips: this.preDetail.trips,
            cost: costo
          })
        }

        this.loading = false;
      });
  }

  crearFacturaVerde() {

    this.formGB.value.customer = this.selectC.nativeElement.value;

    if (this.formGB.invalid || this.selectC.nativeElement.value === '') {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      console.log(this.details);
      return;
    }

    if (this.details.length <= 0) {
      swal('Oops...', 'El detalle esta vacío', 'warning');
      return;
    }

    let greenbill;

    if (this.greenbil._id) {
      return;
    } else {
      greenbill = new GreenBill(
        this.formGB.value.customer,
        'sin asignar',
        'sin asignar',
        moment(this.formGB.value.date, 'DD/MM/YYYY').toDate(),
        this.total,
        false,
        false,
        '',
        '',
        this.details
      );
    }

    this.gbillService.crearFacturaVerde( greenbill )
      .subscribe( () => this.router.navigate(['/gbills']) );
  }

  cargarCPClientes() {
    this.cpService.cargarClientes()
      .subscribe( (res: any) => {
        this.cpcustomers = res.clientes;
      });
  }

  cargarTypeTrips() {
    this.tripService.cargarTypes()
      .subscribe( (res: any) => {
        this.types = res.viajes;
      });
  }

  /* #endregion */



  /* #region  FUNCIONES DE TARIFAS */

  desalojo(mts: number) {

    let tarifa: number = 0;
    let mtscont: number = mts;

    if (mts <= 300) {
      tarifa = 5000;
      return tarifa;
    } else if (mts > 300 && mts <= 2000) {
      tarifa = 5000;
      mtscont = mts - 300;
      tarifa += mtscont * 3.40;
      return tarifa;
    } else if (mts > 2000 && mts <= 8000) {
      tarifa = 10780;
      mtscont = mts - 2000;
      tarifa += mtscont * 2.90;
      return tarifa;
    } else if (mts > 8000 && mts <= 10000) {
      tarifa = 28180;
      mtscont = mts - 8000;
      tarifa += mtscont * 2.54;
      return tarifa;
    } else if (mts > 10000 && mts <= 12000) {
      tarifa = 33260;
      mtscont = mts - 10000;
      tarifa += mtscont * 2.44;
      return tarifa;
    } else if (mts > 12000) {
      tarifa = 38140;
      mtscont = mts - 12000;
      tarifa += mtscont * 2.35;
      return tarifa;
    }

  }

  cantera(mts: number) {
    let tarifa: number = 0;
    let mtscont: number = mts;

    if (mts <= 10000) {
      tarifa += mts * 5.13;
      return tarifa;
    } else if (mts > 10000 && mts <= 15000) {
      tarifa = 51300;
      mtscont = mts - 10000;
      tarifa += mtscont * 4.88;
      return tarifa;
    } else if (mts > 15000 && mts <= 20000) {
      tarifa = 75700;
      mtscont = mts - 15000;
      tarifa += mtscont * 4.63;
      return tarifa;
    } else if (mts > 20000 && mts <= 25000) {
      tarifa = 98850;
      mtscont = mts - 20000;
      tarifa += mtscont * 4.35;
      return tarifa;
    } else if (mts > 25000 && mts <= 30000) {
      tarifa = 120600;
      mtscont = mts - 25000;
      tarifa += mtscont * 4.11;
      return tarifa;
    } else if (mts > 30000) {
      tarifa = 141150;
      mtscont = mts - 30000;
      tarifa += mtscont * 3.90;
      return tarifa;
    }
  }

  descapote(mts: number) {
    let tarifa: number = 0;
    let mtscont: number = mts;

    if (mts <= 300) {
      tarifa = 20000;
      return tarifa;
    } else if (mts > 300 && mts <= 5000) {
      tarifa = 20000;
      mtscont = mts - 300;
      tarifa += mtscont * 4.85;
      return tarifa;
    } else if (mts > 5000 && mts <= 10000) {
      tarifa = 42795;
      mtscont = mts - 5000;
      tarifa += mtscont * 4.25;
      return tarifa;
    } else if (mts > 10000 && mts <= 15000) {
      tarifa = 64045;
      mtscont = mts - 10000;
      tarifa += mtscont * 4.09;
      return tarifa;
    } else if (mts > 15000 && mts <= 20000) {
      tarifa = 84495;
      mtscont = mts - 15000;
      tarifa += mtscont * 3.84;
      return tarifa;
    } else if (mts > 20000 && mts <= 25000) {
      tarifa = 103695;
      mtscont = mts - 20000;
      tarifa += mtscont * 3.64;
      return tarifa;
    } else if (mts > 25000 && mts <= 30000) {
      tarifa = 121895;
      mtscont = mts - 25000;
      tarifa += mtscont * 3.44;
      return tarifa;
    } else if (mts > 30000) {
      tarifa = 139095;
      mtscont = mts - 30000;
      tarifa += mtscont * 3.24;
      return tarifa;
    }
  }

  /* #endregion */

}
