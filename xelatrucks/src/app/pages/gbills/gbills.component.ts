import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatatablesService, GbillService } from '../../services/service.index';
import { GreenBill } from '../../models/gbill.model';
import { DetailBill } from '../../models/gdetail.model';
import * as moment from 'moment/moment';

declare function init_datatables();
declare function destroy_datatables();
declare var swal: any;

@Component({
  selector: 'app-gbills',
  templateUrl: './gbills.component.html',
  styles: []
})
export class GbillsComponent implements OnInit {

  @ViewChild('date1', {static: false}) date1: ElementRef;
  @ViewChild('date2', {static: false}) date2: ElementRef;
  @ViewChild('closeM', {static: false}) closeM: ElementRef;

  formGB: FormGroup;
  greenbil: GreenBill = { _customer: null, noBill: '', serie: '', date: null, total: 0, state: false, paid: false };
  loading: boolean = false;

  bills: GreenBill[] = [];
  nobills: GreenBill[] = [];
  details: DetailBill[] = [];

  oc: string;
  ac: string;

  constructor(
    public dtService: DatatablesService,
    public gbillService: GbillService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);
    this.cargarNoPaid();

    this.formGB = new FormGroup({
      nobill: new FormControl('', Validators.required),
      serie: new FormControl('', Validators.required),
      date: new FormControl(null, Validators.required),
      oc: new FormControl('', Validators.required),
      ac: new FormControl('', Validators.required)
    });
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
        destroy_datatables();

        console.log(res);
        this.bills = res.facturas;
        this.chRef.detectChanges();
        init_datatables();
        this.loading = false;

      });
  }

  cargarNoPaid() {

    this.loading = true;

    this.gbillService.cargarFacturasNoPaid()
      .subscribe((res: any) => {

        destroy_datatables();
        this.nobills = res.facturas;
        this.chRef.detectChanges();
        init_datatables();
        this.loading = false;
      });
  }

  cargarFactura( greenbill: GreenBill ) {
    this.greenbil = greenbill;
  }

  pagarFactura() {

    if (this.formGB.invalid) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    let greenbill;

    if (this.greenbil._id) {
      greenbill = new GreenBill(
        null,
        this.formGB.value.nobill,
        this.formGB.value.serie,
        moment(this.formGB.value.date, 'DD/MM/YYYY').toDate(),
        0,
        false,
        true,
        this.formGB.value.oc,
        this.formGB.value.ac,
        this.details,
        0,
        this.greenbil._id
      );
    } else {
      return;
    }

    this.gbillService.crearFacturaVerde( greenbill )
      .subscribe( () => {
        this.cargarNoPaid();
        this.closeM.nativeElement.click();
        this.resetModal();
      });
  }

  borrarFactura( bill: GreenBill ) {
    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar la factuna número: ' + bill.noBill + ' ' + bill.serie,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {
      if (borrar) {

        bill.state = true;

        this.gbillService.borrarFactura( bill )
          .subscribe( borrado => {
            swal({
              title: 'Exito!',
              text: 'Factura borrada correctamente',
              icon: 'success',
              button: false,
              timer: 1000
            });
            destroy_datatables();
            this.buscarFacturas();
          });
        // empleado.state = true;

        // this.empService.borrarEmpleado( empleado )
        //   .subscribe( borrado => {
        //     this.dtService.destroy_table();
        //     this.cargarEmpleados();
        //   });
      }

    });
  }
}
