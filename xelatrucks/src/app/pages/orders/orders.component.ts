import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PullService, DatatablesService } from 'src/app/services/service.index';
import { Pull } from '../../models/pull.model';

declare function init_datatables();
declare function destroy_datatables();

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styles: []
})
export class OrdersComponent implements OnInit {

  pulls: Pull[] = [];
  pull: Pull = { _order: null, _material: null, mts: 0, totalMts: 0, kg: 0, totalKg: 0 };

  constructor(
    public pullS: PullService,
    public chRef: ChangeDetectorRef,
    public dtService: DatatablesService
  ) { }

  ngOnInit() {
    this.pullS.cargarActivas()
      .subscribe((resp: any) => {
        destroy_datatables();
        // console.log(resp);
        this.pulls = resp.pulls;
        this.chRef.detectChanges();
        init_datatables();
      });
  }

  cargarReporte(pull: Pull) {
    this.pull = pull;

  }

}
