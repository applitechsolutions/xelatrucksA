import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { TripService, DatatablesService } from 'src/app/services/service.index';
import { WhiteTrip } from '../../models/whiteTrip.model';

declare var swal: any;
import * as moment from 'moment/moment';
declare function init_datatables();
declare function destroy_datatables();
declare function init_datatables2();
declare function destroy_datatables2();

@Component({
  selector: 'app-wtrips-history',
  templateUrl: './wtrips-history.component.html',
  styles: [
  ]
})
export class WtripsHistoryComponent implements OnInit {

  @ViewChild('date1') date1: ElementRef;
  @ViewChild('date2') date2: ElementRef;
  loading: boolean = false;

  whiteTripsActive: WhiteTrip[] = [];
  whiteTripsHistory: WhiteTrip[] = [];

  constructor(
    public tripService: TripService,
    public dtService: DatatablesService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);

    this.cargarReportesActivos();
  }

  cargarReportesActivos() {
    this.loading = true;

    this.tripService.cargarWhiteTripsActives()
      .subscribe((res: any) => {
        destroy_datatables();
        this.whiteTripsActive = res.reportes;
        this.loading = false;
        this.chRef.detectChanges();
        init_datatables();
      }, (err) => {
        console.error(err);
        this.loading = false;
      });
  }

  buscarReportesHistorial() {
    if (!this.date1.nativeElement.value || !this.date2.nativeElement.value) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }
    this.loading = true;
    const fecha1 = moment(this.date1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.date2.nativeElement.value, 'DD/MM/YYYY').toDate();
    this.tripService.cargarWhiteTripsHistory(fecha1, fecha2)
      .subscribe((res: any) => {
        destroy_datatables2();
        this.whiteTripsHistory = res.reportes;
        this.loading = false;
        this.chRef.detectChanges();
        init_datatables2();
      }, (err) => {
        console.error(err);
        this.loading = false;
      });
  }

  eliminarViajeBlanco(whiteTrip: WhiteTrip, type) {
    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar el viaje del camión ' + whiteTrip._vehicle.plate,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          whiteTrip.state = true;
          const km = whiteTrip._pull._order._destination.km;
          this.tripService.borrarWhiteTrip(whiteTrip, km)
            .subscribe((borrado: any) => {
              swal({
                title: 'Exito!',
                text: 'Viaje borrado correctamente',
                icon: 'success',
                button: false,
                timer: 1000
              });
              switch (type) {
                case 'actives':
                  this.cargarReportesActivos();
                  break;
                case 'history':
                  this.buscarReportesHistorial();
                  break;
                default:
                  break;
              }
            });
        }
      })
  }


}
