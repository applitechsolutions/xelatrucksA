import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { TripService, DatatablesService } from '../../services/service.index';
import { TankTrip } from '../../models/tankTrip.model';
import * as moment from 'moment/moment';

declare var swal: any;
declare function init_datatables();
declare function destroy_datatables();
@Component({
  selector: 'app-ktrips',
  templateUrl: './ktrips.component.html',
  styles: []
})
export class KtripsComponent implements OnInit {

  loading: boolean = false;
  @ViewChild('date1') date1: ElementRef;
  @ViewChild('date2') date2: ElementRef;

  tankTrips: TankTrip[] = [];
  tankTrip: TankTrip = { _employee: null, _vehicle: null, _destination: null };

  constructor(
    public tripService: TripService,
    public dtService: DatatablesService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);
  }

  eliminarViajeCisterna(tankTrip: TankTrip) {

    const km = tankTrip._destination.km * tankTrip.trips * -1;

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar el viaje del camión ' + tankTrip._vehicle.plate,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          tankTrip.state = true;
          this.tripService.eliminarTankTrip(tankTrip, km)
            .subscribe((borrado: any) => {
              swal({
                title: 'Exito!',
                text: 'Viaje borrado correctamente',
                icon: 'success',
                button: false,
                timer: 1000
              });
              this.buscarReporteCisterna();
            });
        }

      });

  }

  buscarReporteCisterna() {
    this.loading = true;
    const fecha1 = moment(this.date1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.date2.nativeElement.value, 'DD/MM/YYYY').toDate();

    this.tripService.cargarTankTrips(fecha1, fecha2)
      .subscribe((res: any) => {
        destroy_datatables();
        console.log(res);
        this.tankTrips = res.viajesA;
        this.loading = false;
        this.chRef.detectChanges();
        init_datatables();
      }, () => {
        this.loading = false;
      });
  }

}
