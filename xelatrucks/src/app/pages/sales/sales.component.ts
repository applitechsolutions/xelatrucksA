import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SaleService, DatatablesService } from '../../services/service.index';
import { Sale } from '../../models/sale.model';
import { DetailSale } from '../../models/detailSale.model';

import * as moment from 'moment/moment';
declare var swal: any;
declare function init_datatables();
declare function destroy_datatables();
declare function init_datatables2();
declare function destroy_datatables2();

// IMPRESIONES
declare function init_despacho();
@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: []
})
export class SalesComponent implements OnInit, AfterViewInit {

  @ViewChild('date1') date1: ElementRef;
  @ViewChild('date2') date2: ElementRef;

  sales: Sale[] = [];
  salesToday: Sale[] = [];
  sale: Sale = { _customer: null, date: null, state: false, total: 0 };
  details: DetailSale[] = [];
  today;

  loading: boolean = false;
  constructor(
    public saleService: SaleService,
    public dtService: DatatablesService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.today = moment(new Date()).format('DD/MM/YYYY');
    this.listarVentasDia(this.today);
  }

  ngAfterViewInit() {
    this.dtService.init_datePicker(this.today);
    this.dtService.init_timePicker();
  }

  anularVenta(sale: Sale) {
    swal({
      title: '¿Está seguro?',
      text: `Esta a punto de eliminar la venta con factura ${sale.bill} y correlativo ${sale.serie}, esto afectará el inventario`,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(anular => {
        if (anular) {
          sale.state = true;
          this.saleService.anularVenta(sale)
            .subscribe((res: any) => {
              swal({
                title: 'Exito!',
                text: 'Venta anulada correctamente',
                icon: 'success',
                button: false,
                timer: 1000
              });
              this.buscarVentas();
            });
        }
      });
  }

  listarVentasDia(today) {
    const fecha = moment(today, 'DD/MM/YYYY').toDate();
    this.saleService.cargarVentas(fecha, fecha)
      .subscribe((res: any) => {
        destroy_datatables2();
        this.salesToday = res.ventas;
        this.chRef.detectChanges();
        init_datatables2();
      }, (err) => {
        this.loading = false;
        swal({
          title: 'Ooops!',
          text: 'Algo salió mal, intentalo de nuevo' + err.message,
          icon: 'error',
          button: false,
          timer: 1500
        });
      });
  }

  buscarVentas() {
    this.loading = true;
    const fecha1 = moment(this.date1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.date2.nativeElement.value, 'DD/MM/YYYY').toDate();

    this.saleService.cargarVentas(fecha1, fecha2)
      .subscribe((res: any) => {
        destroy_datatables();
        this.sales = res.ventas;
        this.loading = false;
        this.chRef.detectChanges();
        init_datatables();
      }, (err) => {
        this.loading = false;
        swal({
          title: 'Ooops!',
          text: 'Algo salió mal, intentalo de nuevo' + err.message,
          icon: 'error',
          button: false,
          timer: 1500
        });
      });
  }

  verDetalle(sale: Sale) {
    this.sale = sale;
    this.details = sale.details;
  }

  generarDespacho(sale: Sale) {
    this.sale = sale;
    this.chRef.detectChanges(); // IMPRESION DE ORDEN DE DESPACHO
    init_despacho();
  }

  generarBill() {

  }

}
