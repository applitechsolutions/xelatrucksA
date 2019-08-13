import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { MaintenanceService, DatatablesService } from '../../services/service.index';
import { Maintenance } from 'src/app/models/maintenance.model';
import { DetailsSpare } from '../../models/detailsSpare.model';
import * as moment from 'moment/moment';

declare function init_datatables();
declare function destroy_datatables();
@Component({
  selector: 'app-maintenances',
  templateUrl: './maintenances.component.html',
  styles: []
})
export class MaintenancesComponent implements OnInit {

  loading: boolean = false;
  @ViewChild('date1') date1: ElementRef;
  @ViewChild('date2') date2: ElementRef;
  maintenances: Maintenance[] = [];
  detailsV: DetailsSpare[] = [];
  detailsG: DetailsSpare[] = [];

  constructor(
    public mainService: MaintenanceService,
    public dtS: DatatablesService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtS.init_datePicker(today);
  }

  searchTerminados() {
    this.loading = true;
    const fecha1 = moment(this.date1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.date2.nativeElement.value, 'DD/MM/YYYY').toDate();

    this.mainService.cargarTerminados(fecha1, fecha2)
      .subscribe( (res: any) => {
        destroy_datatables();

        console.log(res);
        this.maintenances = res.mantenimientos;
        this.detailsV = res.mantenimientos.detailsV;
        this.detailsG = res.mantenimientos.detailsG;
        this.chRef.detectChanges();
        init_datatables();
        this.loading = false;
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
