import { Component, OnInit } from '@angular/core';
import { MaintenanceService } from '../../services/service.index';
import { Maintenance } from 'src/app/models/maintenance.model';
import { DetailsSpare } from '../../models/detailsSpare.model';

@Component({
  selector: 'app-maintenances',
  templateUrl: './maintenances.component.html',
  styles: []
})
export class MaintenancesComponent implements OnInit {

  maintenances: Maintenance[] = [];
  detailsV: DetailsSpare[] = [];
  detailsG: DetailsSpare[] = [];

  constructor(
    public mainService: MaintenanceService
  ) { }

  ngOnInit() {
    this.mainService.cargarTerminados()
      .subscribe( (res: any) => {

        console.log(res);
        this.maintenances = res.mantenimientos;
        this.detailsV = res.mantenimientos.detailsV;
        this.detailsG = res.mantenimientos.detailsG;

      });
  }

}
