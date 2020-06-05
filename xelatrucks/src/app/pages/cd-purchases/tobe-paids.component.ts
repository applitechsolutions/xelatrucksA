import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PurchaseCDService, DatatablesService } from 'src/app/services/service.index';

import * as moment from 'moment/moment';
import { PurchaseCD } from '../../models/purchaseCD.model';
declare function init_datatables();
declare function destroy_datatables();
declare var swal: any;

@Component({
  selector: 'app-tobe-paids',
  templateUrl: './tobe-paids.component.html',
  styles: [
  ]
})
export class TobePaidsComponent implements OnInit {

  purchases: any[] = [];
  details: any[] = [];

  vencidas = 0;
  saldoPendiente = 0;
  today: string;

  constructor(
    public purchaseS: PurchaseCDService,
    public dpService: DatatablesService,
    public chRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.today = moment(new Date()).format('YYYY-MM-DD');

    this.cargarPendientes();
  }

  cargarPendientes() {
    this.purchaseS.cargarPendientes()
      .subscribe(resp => {
        destroy_datatables();
        this.purchases = resp;

        this.saldoPendiente = this.purchases.reduce((sum, item) => sum + item.total, 0);
        this.chRef.detectChanges();
        init_datatables();
      });
  }

  calculateDiff(dateSent) {
    const currentDate = new Date();
    dateSent = new Date(dateSent);

    // tslint:disable-next-line: max-line-length
    return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate())) / (1000 * 60 * 60 * 24));
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
              this.cargarPendientes();
            });
        }
      });
  }
}
