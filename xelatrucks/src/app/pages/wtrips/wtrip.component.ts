import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DatatablesService } from '../../services/service.index';
import * as $ from 'jquery';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-wtrip',
  templateUrl: './wtrip.component.html',
  styles: []
})
export class WtripComponent implements OnInit, AfterViewInit {

  constructor(
    public dtService: DatatablesService
  ) { }

  ngOnInit() {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);
  }

  ngAfterViewInit() {
    $('.select2').select2();
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);
  }

}
