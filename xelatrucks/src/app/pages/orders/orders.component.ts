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

}
