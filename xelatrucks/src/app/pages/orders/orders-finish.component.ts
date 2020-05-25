import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DatatablesService, PullService, TripService } from 'src/app/services/service.index';
import { Pull } from '../../models/pull.model';
import { WhiteTrip } from 'src/app/models/whiteTrip.model';

import * as moment from 'moment/moment';

declare function init_datatables();
declare function destroy_datatables();

@Component({
  selector: 'app-orders-finish',
  templateUrl: './orders-finish.component.html',
  styles: []
})
export class OrdersFinishComponent implements OnInit {
  @ViewChild('date1') date1: ElementRef;
  @ViewChild('date2') date2: ElementRef;

  pulls: Pull[] = [];
  pull: Pull = {
    _order: {
      _destination: null,
      date: '',
      order: ''
    },
    _material: {
      code: '',
      name: '',
      minStock: 0
    },
    mts: 0,
    totalMts: 0,
    kg: 0,
    totalKg: 0
  };
  loading = false;

  whiteTrips: WhiteTrip[] = [];

  constructor(
    public dtService: DatatablesService,
    public pullS: PullService,
    public chRef: ChangeDetectorRef,
    public tripS: TripService
  ) { }

  ngOnInit() {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);
  }

  buscarFinalizadas() {
    this.loading = true;
    const fecha1 = moment(this.date1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.date2.nativeElement.value, 'DD/MM/YYYY').toDate();

    this.pullS.cargarFinalizadas(fecha1, fecha2)
      .subscribe(resp => {
        destroy_datatables();
        this.pulls = resp;
        console.log(resp);
        this.chRef.detectChanges();
        init_datatables();
        this.loading = false;
      });
  }

  verReportes(pull: Pull) {

    this.loading = true;
    this.pull = pull;

    this.tripS.cargarWhiteTrips(this.pull._id)
      .subscribe((resp: any) => {
        this.dtService.destroy_table2();

        this.whiteTrips = resp.wviajes;

        this.chRef.detectChanges();
        this.dtService.init_tables2();
        this.loading = false;
      });
  }

}
