import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DestinationService } from 'src/app/services/service.index';
import { Tariff } from 'src/app/models/tariff.model';
import { Destination } from '../../models/destination.model';

declare function init_datatables();
declare function destroy_datatables();

@Component({
  selector: 'app-destinations',
  templateUrl: './destinations.component.html',
  styles: []
})
export class DestinationsComponent implements OnInit {

  destinations: Destination[] = [];
  tariffs: Tariff[] = [];

  constructor(
    public destinationS: DestinationService,
    public chRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.destinationS.cargarDestinos()
      .subscribe((resp: any) => {
        destroy_datatables();
        this.destinations = resp.destinos;
        this.chRef.detectChanges();
        init_datatables();
      });
  }

  verTarifas(destination: Destination) {
    this.tariffs = destination.tariff;
  }

}
