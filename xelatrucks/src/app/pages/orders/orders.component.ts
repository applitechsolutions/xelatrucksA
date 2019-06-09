import { Component, OnInit } from '@angular/core';
import { DatatablesService } from '../../services/datatables/datatables.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styles: []
})
export class OrdersComponent implements OnInit {

  constructor(public dtS: DatatablesService) { }

  ngOnInit() {
    this.dtS.init_tables();
  }

}
