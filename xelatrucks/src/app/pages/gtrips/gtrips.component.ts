import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { GreenTrip } from '../../models/greenTrip.model';
import { TripService, DatatablesService } from '../../services/service.index';
import * as moment from 'moment/moment';

declare var swal: any;
declare function init_datatables();
declare function destroy_datatables();

@Component({
  selector: 'app-gtrips',
  templateUrl: './gtrips.component.html',
  styles: []
})
export class GtripsComponent implements OnInit {

  loading: boolean = false;
  @ViewChild('date1', {static: false}) date1: ElementRef;
  @ViewChild('date2', {static: false}) date2: ElementRef;

  greenTrips: GreenTrip[] = [];
  greenTrip: GreenTrip = { _employee: null, _type: null, _vehicle: null, _material: null }

  constructor(
    public tripService: TripService,
    public dtService: DatatablesService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit() {

    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);

  }

  /* #region  LISTAR Reporte Cuadros */

  buscarReporteCuadros() {
    this.loading = true;
    const fecha1 = moment(this.date1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.date2.nativeElement.value, 'DD/MM/YYYY').toDate();

    this.tripService.cargarGreenTrips( fecha1, fecha2 )
    .subscribe((res: any) => {
        destroy_datatables();
        this.greenTrips = res.viajesV;
        this.loading = false;
        this.chRef.detectChanges();
        init_datatables();

      });
  }

  /* #endregion */

}
