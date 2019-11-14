import { Component, OnInit, AfterViewInit } from '@angular/core';
import { VehicleService, GondolaService, DatatablesService } from 'src/app/services/service.index';
import { Vehicle } from 'src/app/models/vehicle.model';
import { Gondola } from 'src/app/models/gondola.model';
import { Mechanic } from 'src/app/models/mech.model';
import { TypeMaintenance } from 'src/app/models/typeMaintenance.model';

import * as $ from 'jquery';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-repairs',
  templateUrl: './repairs.component.html',
  styles: []
})
export class RepairsComponent implements OnInit, AfterViewInit {

  vehicles: Vehicle[] = [];
  gondolas: Gondola[] = [];
  mecanicos: Mechanic[] = []; // Llenar SELECT
  typeMaintenances: TypeMaintenance[] = []; // Llenar SELECT

  constructor(
    public vehicleS: VehicleService,
    public gondolaS: GondolaService,
    public dtS: DatatablesService
  ) { }

  ngOnInit() {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtS.init_datePicker(today);

    this.cargarVehiculos();
    this.cargarGondolas();
  }

  ngAfterViewInit(): void {
    $('.select2').select2();
  }

  cargarGondolas() {
    this.gondolaS.cargarGondolas()
      .subscribe((resp: any) => {
        this.gondolas = resp.gondolas;
      });
  }

  cargarVehiculos() {
    this.vehicleS.cargarVehiculos()
      .subscribe((resp: any) => {
        this.vehicles = resp.vehiculos;
      });
  }

}
