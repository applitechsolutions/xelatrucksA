import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { PurchaseCDService, DatatablesService } from 'src/app/services/service.index';

import * as moment from 'moment/moment';
import { PurchaseCD } from '../../models/purchaseCD.model';
declare function init_datatables();
declare function destroy_datatables();
declare var swal: any;

@Component({
  selector: 'app-cd-purchases',
  templateUrl: './cd-purchases.component.html',
  styles: [
  ]
})
export class CdPurchasesComponent implements OnInit {

  @ViewChild('date1') date1: ElementRef;
  @ViewChild('date2') date2: ElementRef;

  loading = false;

  purchases: any[] = [];
  details: any[] = [];
  fecha1Consulta = '';
  fecha2Consulta = '';
  pendientes = 0;
  saldoPendiente = 0;
  total = 0;
  today = '';
  today2 = '';

  constructor(
    public purchaseS: PurchaseCDService,
    public dpService: DatatablesService,
    public chRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.today = moment(new Date()).format('DD/MM/YYYY');
    this.today2 = moment(new Date()).format('YYYY-MM-DD');
    this.dpService.init_datePicker(this.today);
  }

  calculateDiff(dateSent) {
    const currentDate = new Date();
    dateSent = new Date(dateSent);

    // tslint:disable-next-line: max-line-length
    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
  }

  searchP() {
    this.loading = true;
    const fecha1 = moment(this.date1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.date2.nativeElement.value, 'DD/MM/YYYY').toDate();

    this.purchaseS.cargarCompras(fecha1, fecha2)
      .subscribe(resp => {
        destroy_datatables();
        this.purchases = resp;

        console.log(resp);
        this.saldoPendiente = 0;
        this.purchases.forEach((index) => {
          if (!index.paid) {
            this.pendientes++;
            this.saldoPendiente += index.total;
          }
        });
        this.total = this.purchases.reduce((sum, item) => sum + item.total, 0);
        this.fecha1Consulta = this.date1.nativeElement.value;
        this.fecha2Consulta = this.date2.nativeElement.value;
        this.chRef.detectChanges();
        init_datatables();
        this.loading = false;
      });
  }

  verDetalles(purchase: PurchaseCD) {
    this.details = purchase.details;
  }

  pagarCompra(purchase: PurchaseCD) {

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de marcar como pagada la compra',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {

        if (borrar) {
          this.purchaseS.pagarCompra(purchase._id)
            .subscribe((pagado: any) => {
              this.searchP();
            });
        }
      });
  }

}
