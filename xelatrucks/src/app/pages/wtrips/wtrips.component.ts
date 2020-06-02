import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { WhiteTrip } from '../../models/whiteTrip.model';
import { TripService, DatatablesService } from "../../services/service.index";
import * as moment from 'moment/moment';

declare var swal: any;
declare function init_datatables();
declare function destroy_datatables();
@Component({
  selector: 'app-wtrips',
  templateUrl: './wtrips.component.html',
  styles: []
})
export class WtripsComponent implements OnInit {

  loading: boolean = false;
  @ViewChild('date1') date1: ElementRef;
  @ViewChild('date2') date2: ElementRef;
  id: string = '';

  whiteTrips: WhiteTrip[] = [];
  whiteTrip: WhiteTrip = { _employee: null, _vehicle: null, _pull: null, date: null, noTicket: '', mts: 0, kgB: 0, kgT: 0, kgN: 0, checkIN: null, checkOUT: null, tariff: 0, invoiced: false };

  constructor(
    public activatedRouter: ActivatedRoute,
    public tripService: TripService,
    public dtService: DatatablesService,
    private chRef: ChangeDetectorRef
  ) {
    activatedRouter.params.subscribe(params => {
      this.id = params.id;
    })
  }

  ngOnInit() {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);
  }

  eliminarViajeBlanco(whiteTrip: WhiteTrip) {
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
          this.tripService.eliminarWhiteTrip(whiteTrip, km)
            .subscribe((borrado: any) => {
              swal({
                title: 'Exito!',
                text: 'Viaje borrado correctamente',
                icon: 'success',
                button: false,
                timer: 1000
              });
              this.buscarReporteLineas();
            });
        }
      })
  }

  buscarReporteLineas() {
    this.loading = true;
    const fecha1 = moment(this.date1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.date2.nativeElement.value, 'DD/MM/YYYY').toDate();

    this.tripService.cargarWhiteTripsPorFechas(this.id, fecha1, fecha2)
      .subscribe((res: any) => {
        destroy_datatables();
        this.whiteTrips = res.wviajes;
        this.loading = false;
        this.chRef.detectChanges();
        init_datatables();
      }, (err) => {
        console.error(err);
        this.loading = false;
      });
  }

}
