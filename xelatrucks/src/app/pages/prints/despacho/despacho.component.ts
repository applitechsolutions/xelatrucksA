import { Component, OnInit, Input } from '@angular/core';
import { Sale } from '../../../models/sale.model';

import * as moment from 'moment/moment';

@Component({
  selector: 'app-despacho',
  templateUrl: './despacho.component.html',
  styles: [
  ]
})
export class DespachoComponent implements OnInit {

  @Input() sale: Sale;
  today2 = '';

  constructor() { }

  ngOnInit(): void {
    this.today2 = moment(new Date()).format('DD/MM/YYYY');
  }

}
