import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatatablesService, BuySpareService } from 'src/app/services/service.index';
import { BuySpare } from '../../models/buySpare.model';
import { DetailsSpare } from '../../models/detailsSpare.model';

@Component({
  selector: 'app-buy-spares',
  templateUrl: './buy-spares.component.html',
  styles: []
})
export class BuySparesComponent implements OnInit {

  buySpares: BuySpare[] = [];
  details: DetailsSpare[] = [];

  constructor(
    public dtS: DatatablesService,
    public bsS: BuySpareService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cargarProveedores();
  }

  cargarProveedores() {
    this.bsS.cargarCompras()
      .subscribe( (resp: any) => {
        this.buySpares = resp.compras;
        console.log(resp);
        console.log(this.buySpares);

        this.chRef.detectChanges();
        this.dtS.init_tables();
      });
  }

  verDetalles(buySpare: BuySpare) {
    this.dtS.destroy_table2();

    this.details = buySpare.details;
    console.log(this.details);

    this.chRef.detectChanges();
    this.dtS.init_tables2();
  }

}
