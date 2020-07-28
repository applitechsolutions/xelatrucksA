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

  report: any[] = [];
  tripsT = 0;
  kmsT = 0;

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
      const unionArrays = [
        ...resp.greenTrips,
        ...resp.whiteTrips,
        ...resp.tankTrips
      ];
      console.log(resp);
      // console.log(this.agruparArreglo(unionArrays, '_id'));
      this.report = Object.values(this.agruparArreglo(unionArrays, '_id'));
      this.report.sort((a, b) => {
        return (parseInt(a._id.split(' ')[0], 10) - parseInt(b._id.split(' ')[0], 10));
      });
      this.totals();

      this.chRef.detectChanges();
      init_datatables();
      this.loading = false;
    });
  }

  agruparArreglo(miarray, prop) {
    return miarray.reduce((groups, item) => {
      const val = item[prop];
      groups[val] = groups[val] || { _id: item._id, viajes: 0, total: 0 };
      groups[val].viajes += item.viajes;
      groups[val].total += item.total;
      return groups;
    }, {});
  }


  totals() {
    // SUMAS PARA LOS TOTALES -------------
    this.tripsT = this.report.reduce((sum, item) => sum + item.viajes, 0);
    this.kmsT = this.report.reduce((sum, item) => sum + item.total, 0);
  }

}
