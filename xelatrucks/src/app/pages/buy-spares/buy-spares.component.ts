import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { DatatablesService, BuySpareService } from 'src/app/services/service.index';
import { BuySpare } from '../../models/buySpare.model';
import { DetailsSpare } from '../../models/detailsSpare.model';
import * as moment from 'moment/moment';

declare function init_datatables();
declare function destroy_datatables();

@Component({
  selector: 'app-buy-spares',
  templateUrl: './buy-spares.component.html',
  styles: []
})
export class BuySparesComponent implements OnInit {

  loading: boolean = false;
  @ViewChild('date1') date1: ElementRef;
  @ViewChild('date2') date2: ElementRef;

  buySpares: BuySpare[] = [];
  details: DetailsSpare[] = [];

  subtotal: number = 0.00;
  totalDisc: number = 0.00;
  fecha1Consulta: string = '';
  fecha2Consulta: string = '';

  constructor(
    public dtS: DatatablesService,
    public bsS: BuySpareService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtS.init_datePicker(today);
  }

  cargarCompras() {
    this.loading = true;
    const fecha1 = moment(this.date1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.date2.nativeElement.value, 'DD/MM/YYYY').toDate();

    this.bsS.cargarCompras(fecha1, fecha2)
      .subscribe( (resp: any) => {
        destroy_datatables();
        this.buySpares = resp;

        this.calcularTotales();
        this.fecha1Consulta = this.date1.nativeElement.value;
        this.fecha2Consulta = this.date2.nativeElement.value;
        this.chRef.detectChanges();
        init_datatables();
        this.loading = false;
      });
  }

  verDetalles(buySpare: BuySpare) {
    this.dtS.destroy_table2();

    this.details = buySpare.details;
    // console.log(this.details);

    this.chRef.detectChanges();
    this.dtS.init_tables2();
  }

  calcularTotales() {
    // SUMAS PARA LOS TOTALES Y DESCUENTOS -------------
    this.subtotal = this.buySpares.reduce((sum, item) => sum + item.total, 0);
    this.totalDisc = this.buySpares.reduce((sum, item) => sum + item.discount, 0);
    // ------------
  }

}
