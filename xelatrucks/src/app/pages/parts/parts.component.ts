import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatatablesService } from '../../services/service.index';
import { PartService } from '../../services/service.index';
import { AutoCellar } from '../../models/autoCellar';
import { Storage } from '../../models/storage';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-parts',
  templateUrl: './parts.component.html',
  styles: []
})
export class PartsComponent implements OnInit {

  repuestos: Storage[] = [];

  constructor(public dtService: DatatablesService, public partService: PartService, private chRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.cargarRepuestos();
  }

  cargarRepuestos() {
    console.log('cargando repuestos');
    this.partService.cargarRepuestos()
    .subscribe((resp: any) => {
      resp.repuestos.map((res: any) => this.repuestos = res.storage);
      this.chRef.detectChanges();

      this.dtService.init_tables();

    });

  }

}
