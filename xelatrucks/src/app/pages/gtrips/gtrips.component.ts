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
  @ViewChild('date1') date1: ElementRef;
  @ViewChild('date2') date2: ElementRef;

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

  eliminarViajeVerde(greenTrip: GreenTrip) {

    const km = greenTrip._type.km * greenTrip.trips * -1;

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar el viaje del camión ' + greenTrip._vehicle.plate,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          this.tripService.eliminarGreenTrip(greenTrip, km)
            .subscribe((borrado: any) => {
              swal({
                title: 'Exito!',
                text: 'Viaje borrado correctamente',
                icon: 'success',
                button: false,
                timer: 1000
              });
              this.buscarReporteCuadros();
            });
        }

      });
  }

  /* #region  LISTAR Reporte Cuadros */

  buscarReporteCuadros() {
    this.loading = true;
    const fecha1 = moment(this.date1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.date2.nativeElement.value, 'DD/MM/YYYY').toDate();

    this.tripService.cargarGreenTrips(fecha1, fecha2)
      .subscribe((res: any) => {
        destroy_datatables();
        this.greenTrips = res.viajesV;
        this.loading = false;
        this.chRef.detectChanges();
        init_datatables();

      }, () => {
        this.loading = false;
      });
  }

  /* #endregion */

}
