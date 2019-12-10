import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';

import * as $ from 'jquery';
import * as moment from 'moment/moment';
import { DatatablesService, UserService, TripService } from 'src/app/services/service.index';

declare function init_datatables();
declare function destroy_datatables();
declare function init_reports();
declare var swal: any;

@Component({
  selector: 'app-green-trips',
  templateUrl: './green-trips.component.html',
  styles: []
})
export class GreenTripsComponent implements OnInit {

  @ViewChild('dateP1', { static: false }) dateP1: ElementRef;
  @ViewChild('dateP2', { static: false }) dateP2: ElementRef;
  loading: boolean = false;

  gTrips: any[] = [];

  constructor(
    public dtService: DatatablesService,
    private chRef: ChangeDetectorRef,
    public userS: UserService,
    public tripS: TripService
  ) { }

  ngOnInit() {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);
  }

  searchB() {

    if (!this.dateP1.nativeElement.value || !this.dateP2.nativeElement.value) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    this.loading = true;
    const fecha1 = moment(this.dateP1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.dateP2.nativeElement.value, 'DD/MM/YYYY').toDate();


    // this.buySpareS.cargarComprasProvider(_id, fecha1, fecha2).subscribe(resp => {
    //   destroy_datatables();
    //   this.buySpares = resp;
    //   // console.log(this.buySpares);
    //   this.totalsB();
    //   this.date1Consulta = this.dateP1.nativeElement.value;
    //   this.date2Consulta = this.dateP2.nativeElement.value;

    //   this.chRef.detectChanges();
    //   init_datatables();
    //   this.loading = false;
    // });
  }
}
