import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DatatablesService, DestinationService, WbillService } from 'src/app/services/service.index';
import { Destination } from '../../models/destination.model';
import { CPCustomer } from 'src/app/models/CPcustomer.model';
import { DetailWbill } from '../../models/wdetail.model';

import * as $ from 'jquery';
import * as moment from 'moment/moment';
import swal from 'sweetalert';

declare function init_datatables();
declare function destroy_datatables();

@Component({
  selector: 'app-wbill',
  templateUrl: './wbill.component.html',
  styles: []
})
export class WbillComponent implements OnInit, AfterViewInit {

  @ViewChild('selectD', { static: false }) selectD: ElementRef;
  @ViewChild('date1', { static: false }) date1: ElementRef;
  @ViewChild('date2', { static: false }) date2: ElementRef;

  loading = false;
  destinations: Destination[] = [];
  cpcustomers: CPCustomer[] = [];
  detailBills: DetailWbill[] = [];

  formaDeCobro = '';

  formWB: FormGroup;

  constructor(
    public dtService: DatatablesService,
    public destinationS: DestinationService,
    public wbillS: WbillService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);

    this.cargarDestinos();
  }

  ngAfterViewInit() {
    $('.select2').select2();
  }

  cargarDestinos() {
    this.destinationS.cargarDestinos()
      .subscribe((resp: any) => {
        this.destinations = resp.destinos;
      });
  }

  generarPreDetalle() {
    const fecha1 = moment(this.date1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.date2.nativeElement.value, 'DD/MM/YYYY').toDate();
    const idDestination = this.selectD.nativeElement.value;

    if (fecha1 > fecha2 || idDestination === '') {
      swal('Oops...', 'Debe llenar todos los campos o los valores no son válidos', 'warning');
      return;
    }

    this.wbillS.cargarPreDetalle(idDestination, fecha1, fecha2)
      .subscribe((resp: any) => {

        // console.log(resp);

        if (resp.preDetail.length <= 0) {
          swal('Oops...', 'No hay viajes en ese rango de fechas', 'warning');
          // this.details = [];
          return;
        }
        destroy_datatables();
        this.loading = true;

        const row = this.destinations.find(e => e._id === this.selectD.nativeElement.value);
        this.formaDeCobro = row.type;

        this.detailBills = resp.preDetail;

        this.chRef.detectChanges();
        init_datatables();

        this.loading = false;

      });
  }

  crearFacturaLineas() {
    swal('Oops...', 'Estamos trabajando para completar esta parte...', 'warning');
  }

}
