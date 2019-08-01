import { Component, OnInit } from '@angular/core';
import { MaintenanceService } from '../../services/service.index';
import { Maintenance } from 'src/app/models/maintenance.model';

@Component({
  selector: 'app-maintenances',
  templateUrl: './maintenances.component.html',
  styles: []
})
export class MaintenancesComponent implements OnInit {

  maintenances: Maintenance[] = [];

  constructor(
    public mainService: MaintenanceService
  ) { }

  ngOnInit() {
    this.mainService.cargarTerminados()
      .subscribe( (res: any) => {

        console.log(res);
        this.maintenances = res.mantenimientos;

      });
  }

}
