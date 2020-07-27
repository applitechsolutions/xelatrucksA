import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { DatatablesService, UserService, VehicleService } from 'src/app/services/service.index';

import * as moment from 'moment/moment';
declare function init_datatables();
declare function destroy_datatables();
declare function init_reports();
declare var swal: any;

@Component({
  selector: 'app-km-by-destinations',
  templateUrl: './km-by-destinations.component.html',
  styles: [
  ]
})
export class KmByDestinationsComponent implements OnInit {

  @ViewChild('date1') date1: ElementRef;
  @ViewChild('date2') date2: ElementRef;
  loading: boolean = false;

  today: Date;
  titulo = '';
  subTitulo = '';

  constructor(
    public dtService: DatatablesService,
    private chRef: ChangeDetectorRef,
    public userS: UserService,
    public vehicleS: VehicleService
  ) { }

  ngOnInit(): void {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);
  }

  createReport() {
    this.today = new Date();
    this.chRef.detectChanges();
    init_reports();
  }

  search() {

    if (!this.date1.nativeElement.value || !this.date2.nativeElement.value) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    this.loading = true;
    const fecha1 = moment(this.date1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.date2.nativeElement.value, 'DD/MM/YYYY').toDate();
    this.titulo = 'Rangos de kilómetros recorridos';
    this.subTitulo = this.date1.nativeElement.value + ' - ' + this.date2.nativeElement.value;

    this.vehicleS.cargarRptKmtsByDestinations(fecha1, fecha2).subscribe((resp: any) => {
      destroy_datatables();
      console.log(resp);
      this.totals();

      this.chRef.detectChanges();
      init_datatables();
      this.loading = false;
    });
  }

  totals() {
    // SUMAS PARA LOS TOTALES -------------
    // this.greenTripsT = this.greenTrips.reduce((sum, item) => sum + item.trips, 0);
    // this.greenKms = this.greenTrips.reduce((sum, item) => sum + (item.trips * item._type.km), 0);
    // this.whiteKms = this.whiteTrips.reduce((sum, item) => sum + (item._pull._order._destination.km * 2), 0);
  }

}
