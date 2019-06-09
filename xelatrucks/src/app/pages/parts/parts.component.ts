import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatatablesService } from '../../services/service.index';
import { Part, Cellar } from '../../models/part.model';
import { PartService } from '../../services/service.index';
import { AutoCellar } from '../../models/autoCellar';

@Component({
  selector: 'app-parts',
  templateUrl: './parts.component.html',
  styles: []
})
export class PartsComponent implements OnInit {

  repuestos: Part[] = [];
  cellar: AutoCellar[] = [];

  constructor(public dtService: DatatablesService, public partService: PartService, private chRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.cargarRepuestos();
  }

  cargarRepuestos() {
    console.log('cargando repuestos');
    this.partService.cargarRepuestos()
    .subscribe((resp: any) => {
      this.repuestos = resp.repuestos;
      this.cellar = this.repuestos
                      .map((respuesta: any) => respuesta.cellar);
      console.log(this.cellar);

      this.chRef.detectChanges();

      this.dtService.init_tables();

      });

  }

}
