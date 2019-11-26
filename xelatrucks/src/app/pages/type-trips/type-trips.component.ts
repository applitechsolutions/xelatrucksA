import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
// import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
// import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Type } from '../../models/type.model';
import { Tariff } from '../../models/tariff.model';
import { TypeTripService, DatatablesService } from '../../services/service.index';


// declare var swal: any;
declare function init_datatables();
declare function destroy_datatables();
@Component({
  selector: 'app-type-trips',
  templateUrl: './type-trips.component.html',
  styles: []
})
export class TypeTripsComponent implements OnInit {

  types: Type[] = [];
  tariffs: Tariff[] = [];

  constructor(
    public typeService: TypeTripService,
    public dtService: DatatablesService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cargarTipos();
  }

  cargarTipos() {

    this.typeService.cargarTypes()
      .subscribe((res: any) => {
        this.types = res.viajes;
        destroy_datatables();
        this.chRef.detectChanges();
        init_datatables();
      });
  }

  verTarifas( type: Type ) {

    this.tariffs = type.tariff;

  }

}
