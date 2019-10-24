import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild('date1') date1: ElementRef;
  @ViewChild('date2') date2: ElementRef;

  loading: boolean = false;

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
    this.dtService.init_datePicker2();
  }

  buscarFacturas() {
    if (this.date1.nativeElement.value === '' || this.date2.nativeElement.value === '') {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    const fecha1 = moment(this.date1.nativeElement.value, 'DD/MM/YYYY hh:mm').toDate();
    const fecha2 = moment(this.date2.nativeElement.value, 'DD/MM/YYYY hh:mm').toDate();

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

  actualizarOC( bill: GreenBill ) {

    if (bill.oc === '') {
      swal('Oops...', 'No hay ningun valor ingresado', 'warning');
      return;
    }

    this.gbillService.crearFacturaVerde( bill )
      .subscribe( (res: any) => {
        console.log(res);
        swal({
          title: 'Exito!',
          text: 'Orden de compra actualizada correctamente',
          icon: 'success',
          button: false,
          timer: 1000
        });
      });
  }

  actualizarAC( bill: GreenBill ) {

    if (bill.ac === '') {
      swal('Oops...', 'No hay ningun valor ingresado', 'warning');
      return;
    }

    this.gbillService.crearFacturaVerde( bill )
      .subscribe( (res: any) => {
        console.log(res);
        swal({
          title: 'Exito!',
          text: 'Orden de aceptación actualizada correctamente',
          icon: 'success',
          button: false,
          timer: 1000
        });
      });
  }

  pagarFactura( bill: GreenBill ) {

    if (bill.ac === '' || bill.oc === '') {
      swal('Oops...', 'No puede pagar la factura sin orden de compra u orden de aceptación', 'warning');
      return;
    }

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de pagar la factuna número: ' + bill.noBill,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {
      if (borrar) {

        bill.paid = true;

        this.gbillService.crearFacturaVerde( bill )
          .subscribe( borrado => {
            swal({
              title: 'Exito!',
              text: 'Factura pagada correctamente',
              icon: 'success',
              button: false,
              timer: 1000
            });
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

  borrarFactura( bill: GreenBill ) {
    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar la factuna número: ' + bill.noBill,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {
      if (borrar) {

        bill.state = true;

        this.gbillService.crearFacturaVerde( bill )
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
