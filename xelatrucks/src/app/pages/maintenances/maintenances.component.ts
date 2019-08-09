import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MaintenanceService, DatatablesService } from '../../services/service.index';
import { Maintenance } from 'src/app/models/maintenance.model';
import { DetailsSpare } from '../../models/detailsSpare.model';

declare function init_datatables();
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
    public mainService: MaintenanceService,
    public dtS: DatatablesService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.mainService.cargarTerminados()
      .subscribe( (res: any) => {

        console.log(res);
        this.maintenances = res.mantenimientos;
        this.detailsV = res.mantenimientos.detailsV;
        this.detailsG = res.mantenimientos.detailsG;
        this.chRef.detectChanges();
        init_datatables();
      });
  }

  verDetallesV( maintenance: Maintenance ) {
    this.dtS.destroy_table();

    this.detailsV = maintenance.detailsV;

    this.chRef.detectChanges();
    this.dtS.init_tables();
  }

  verDetallesG( maintenance: Maintenance ) {
    this.dtS.destroy_table2();

    this.detailsG = maintenance.detailsG;

    this.chRef.detectChanges();
    this.dtS.init_tables2();
  }

}
