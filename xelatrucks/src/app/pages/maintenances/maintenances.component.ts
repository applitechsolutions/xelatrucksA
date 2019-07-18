import { Component, OnInit } from '@angular/core';
import { Vehicle } from 'src/app/models/vehicle.model';
import { Gondola } from 'src/app/models/gondola.model';
import { GondolaService } from '../../services/gondolas/gondola.service';
import { VehicleService } from '../../services/vehicles/vehicle.service';

@Component({
  selector: 'app-maintenances',
  templateUrl: './maintenances.component.html',
  styles: []
})
export class MaintenancesComponent implements OnInit {

  constructor( ) { }

  ngOnInit() {

  }  

}
