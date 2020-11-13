import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatatablesService, GbillService } from '../../services/service.index';
import { GreenBill } from '../../models/gbill.model';
import { DetailBill } from '../../models/gdetail.model';
import * as moment from 'moment/moment';

declare function init_datatables();
declare function destroy_datatables();
declare function init_datatables2();
declare function destroy_datatables2();
declare function init_datatables3();
declare function destroy_datatables3();
declare var swal: any;

@Component({
  selector: 'app-gbills',
  templateUrl: './gbills.component.html',
  styles: []
})
export class GbillsComponent implements OnInit {

  @ViewChild('date1') date1: ElementRef;
  @ViewChild('date2') date2: ElementRef;
  @ViewChild('closeM') closeM: ElementRef;
  @ViewChild('closeM2') closeM2: ElementRef;
  @ViewChild('payDoc') payDoc: ElementRef;

  formGB: FormGroup;
  greenbill: GreenBill = { _customer: null, noBill: '', serie: '', date: null, total: 0, state: false, paid: false };
  loading: boolean = false;
  loadingM: boolean = false;

  preBills: GreenBill[] = [];
  creditBills: GreenBill[] = [];
  today;
  today2;
  bills: GreenBill[] = [];
  details: DetailBill[] = [];

  oc: string;
  ac: string;

  constructor(
    public dtService: DatatablesService,
    public gbillService: GbillService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.today = moment(new Date()).format('DD/MM/YYYY');
    this.today2 = moment(new Date()).format('YYYY-MM-DD');
    this.dtService.init_datePicker(this.today);
    this.cargarPreFacturas();
    this.cargarCreditosFacturas();

    this.formGB = new FormGroup({
      nobill: new FormControl('', Validators.required),
      serie: new FormControl('', Validators.required),
      date: new FormControl(null, Validators.required),
      oc: new FormControl('', Validators.required),
      ac: new FormControl('', Validators.required)
    });
  }

  calculateDiff(dateSent){
    let currentDate = new Date();
    dateSent = new Date(dateSent);

    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) ) /(1000 * 60 * 60 * 24));
}

  resetModal() {
    this.formGB.reset();
  }

  buscarFacturas() {
    if (this.date1.nativeElement.value === '' || this.date2.nativeElement.value === '') {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    const fecha1 = moment(this.date1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.date2.nativeElement.value, 'DD/MM/YYYY').toDate();

    if (fecha1 > fecha2) {
      swal('Oops...', 'El rango de fechas no es válido', 'warning');
      return;
    }

    this.loading = true;

    this.gbillService.cargarFacturas( fecha1, fecha2 )
      .subscribe((res: any) => {
        destroy_datatables3();

        this.bills = res.facturas;
        this.chRef.detectChanges();
        init_datatables3();
        this.loading = false;

      });
  }

  cargarPreFacturas() {

    this.gbillService.cargarPreFacturas()
      .subscribe((res: any) => {

        destroy_datatables();
        this.preBills = res.facturas;
        this.chRef.detectChanges();
        init_datatables();
      });
  }

  cargarCreditosFacturas() {

    this.gbillService.cargarCreditosFacturas()
      .subscribe((res: any) => {

        destroy_datatables2();
        this.creditBills = res.facturas;
        this.chRef.detectChanges();
        init_datatables2();
      });
  }

  cargarFactura( greenbill: GreenBill ) {
    this.greenbill = greenbill;
  }

  confirmarPreFactura() {

    if (this.formGB.invalid) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    this.loadingM = true;

    this.greenbill.noBill = this.formGB.value.nobill;
    this.greenbill.serie = this.formGB.value.serie;
    this.greenbill.date = moment(this.formGB.value.date, 'DD/MM/YYYY').toDate();
    this.greenbill.oc = this.formGB.value.oc;
    this.greenbill.ac = this.formGB.value.ac;

    this.gbillService.crearFacturaVerde( this.greenbill )
      .subscribe( () => {
        this.loadingM = false;
        this.closeM.nativeElement.click();
        this.resetModal();
        this.cargarPreFacturas();
        this.cargarCreditosFacturas();
      });
  }

  confirmarPago() {
    this.loadingM = true;
    this.greenbill.paidDoc = this.payDoc.nativeElement.value;
    this.greenbill.paid = true;

    this.gbillService.crearFacturaVerde( this.greenbill )
      .subscribe( () => {
        this.loadingM = false;
        this.closeM2.nativeElement.click();
        this.payDoc.nativeElement.value = '';
        this.cargarCreditosFacturas();
      });
  }

  borrarFactura( bill: GreenBill ) {
    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar la factura con total: Q' + bill.total.toFixed(2),
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {
      if (borrar) {

        this.loading = true;
        bill.state = true;

        this.gbillService.borrarFactura( bill )
          .subscribe( borrado => {
          this.loading = false;
            swal({
              title: 'Exito!',
              text: 'Factura borrada correctamente',
              icon: 'success',
              button: false,
              timer: 1000
            });
            this.cargarPreFacturas();
            this.cargarCreditosFacturas();
            this.buscarFacturas();
          });
      }

    });
  }

}
