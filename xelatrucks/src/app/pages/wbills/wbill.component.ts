import { Component, OnInit } from '@angular/core';
import { Destination } from '../../models/destination.model';
import { FormGroup } from '@angular/forms';
import { CPCustomer } from 'src/app/models/CPcustomer.model';

@Component({
  selector: 'app-wbill',
  templateUrl: './wbill.component.html',
  styles: []
})
export class WbillComponent implements OnInit {

  destinations: Destination[] = [];
  cpcustomers: CPCustomer[] = [];

  formWB: FormGroup;

  constructor() { }

  ngOnInit() {
  }

  crearFacturaLineas() {

  }

}
