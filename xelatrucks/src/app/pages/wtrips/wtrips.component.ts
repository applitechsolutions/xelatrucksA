import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { WhiteTrip } from '../../models/whiteTrip.model';
import { TripService, DatatablesService } from "../../services/service.index";

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
    this.cargarReporteLineas();
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
          this.tripService.borrarWhiteTrip(whiteTrip, km)
            .subscribe((borrado: any) => {
              swal({
                title: 'Exito!',
                text: 'Viaje borrado correctamente',
                icon: 'success',
                button: false,
                timer: 1000
              });
              this.cargarReporteLineas();
            });
        }
      })
  }

  cargarReporteLineas() {
    this.loading = true;

    this.tripService.cargarWhiteTrips(this.id)
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
