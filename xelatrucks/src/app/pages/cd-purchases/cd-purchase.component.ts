import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { DatatablesService, TripService, OrderService, PurchaseCDService } from 'src/app/services/service.index';
import { PurchaseCD } from '../../models/purchaseCD.model';
import { Order } from '../../models/order.model';

import PerfectScrollbar from 'perfect-scrollbar';
import * as $ from 'jquery';
import * as moment from 'moment/moment';
import '../../../assets/vendor/select2/js/select2.js';
declare var swal: any;

@Component({
  selector: 'app-cd-purchase',
  templateUrl: './cd-purchase.component.html',
  styles: [
  ]
})
export class CdPurchaseComponent implements OnInit, AfterViewInit {

  @ViewChild('scroll') scroll: ElementRef; // id para perfectScrollBar
  @ViewChild('date') date: ElementRef;
  @ViewChild('selectO') selectO: ElementRef;
  @ViewChild('closeQ') closeQ: ElementRef;
  loading = false;

  orders: Order[] = [];
  whiteTrips: any[] = [];

  purchaseCD: PurchaseCD = {
    date: '',
    noBill: '',
    serie: '',
    sap: '',
    _order: null,
    details: [],
    total: 0,
    payment: true,
    paid: false
  };
  detail: any = {
    _whiteTrip: {
      noTicket: ''
    },
    cost: 0
  };

  constructor(
    public datatableS: DatatablesService,
    public tripS: TripService,
    public orderS: OrderService,
    public purchaseCDS: PurchaseCDService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.datatableS.init_datePicker(today);

    this.cargarReportes();
    this.cargarOrdenes();
  }

  ngAfterViewInit() {
    $('.select2').select2();
  }

  cargarReportes() {
    this.tripS.cargarWhiteTripsPurchaseCD()
      .subscribe((resp: any) => {
        this.whiteTrips = resp.viajesBlancos;
        const ps = new PerfectScrollbar(this.scroll.nativeElement); // Inicializamos el perfectScrollBar
      });
  }

  cargarOrdenes() {
    this.orderS.cargarOrdenesPurchaseCD()
      .subscribe((resp: any) => {
        this.orders = resp.ordenes;
      });
  }

  cargarModal(whiteTrip: any) {
    this.detail._whiteTrip = whiteTrip;
  }

  agregarDetalle() {

    this.purchaseCD.details.push({
      _whiteTrip: this.detail._whiteTrip,
      cost: this.detail.cost
    });

    // ELIMINAMOS EL REPORTE DEL LISTADO
    const index = this.whiteTrips.findIndex(item => item._id === this.detail._whiteTrip._id);
    this.whiteTrips.splice(index, 1);

    // SUMAR AL TOTAL
    this.purchaseCD.total = this.purchaseCD.details.reduce((sum, item) => sum + (item._whiteTrip.mts * item.cost), 0);

    swal({
      title: '¡Agregado!',
      text: 'Reporte agregado al detalle',
      icon: 'success',
      button: false,
      timer: 1000
    });
    this.detail = {
      _whiteTrip: {
        noTicket: ''
      },
      cost: 0
    };
    this.closeQ.nativeElement.click();
  }

  quitarDetalle(detail: any) {

    // console.log(detail);
    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar un registro del detalle, esto afectará el total de la compra',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          this.whiteTrips.push(detail._whiteTrip);
          const index = this.purchaseCD.details.findIndex(item => item._whiteTrip && item._whiteTrip._id === detail._whiteTrip._id);
          // ELIMINAMOS EL DETALLE en base al index encontrado
          this.purchaseCD.details.splice(index, 1);

          // SUMAR AL TOTAL
          this.purchaseCD.total = this.purchaseCD.details.reduce((sum, item) => sum + (item._whiteTrip.mts * item.cost), 0);
        }
      });
  }

  redondear(decimals: number) {
    this.purchaseCD.total = Number(this.purchaseCD.total) + Number(decimals);
  }

  crearCompra() {

    if (this.selectO.nativeElement.value === '' || this.date.nativeElement.value === '') {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    // SELECT VALIDATORS
    this.purchaseCD._order = this.selectO.nativeElement.value;
    const fecha = moment(this.date.nativeElement.value, 'DD/MM/YYYY').toDate();
    this.purchaseCD.date = fecha.toString();

    if (this.purchaseCD.total === 0) {
      swal('Oops...', 'No puede guardar una compra en Q 0.00', 'warning');
      return;
    }

    let paid = false;
    this.loading = true;

    if (this.purchaseCD.payment === true) {
      paid = false;
    } else {
      paid = true;
    }
    this.purchaseCD.paid = paid;

    this.purchaseCDS.crearCompra(this.purchaseCD)
      .subscribe(resp => {
        // console.log(resp);
        this.router.navigate(['/cd/tobepaids']);
        this.loading = false;
      });
  }

}
