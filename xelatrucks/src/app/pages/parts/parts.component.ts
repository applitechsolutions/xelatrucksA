import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatatablesService, PartService } from '../../services/service.index';
import { Storage } from '../../models/storage';
import { AutoCellar } from '../../models/autoCellar';

declare var swal: any;


@Component({
  selector: 'app-parts',
  templateUrl: './parts.component.html',
  styles: []
})
export class PartsComponent implements OnInit {

  repuestos: Storage[] = [];
  idC: string;

  constructor(public dtService: DatatablesService, public partService: PartService, private chRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.cargarRepuestos();
  }

  cargarRepuestos() {
    this.partService.cargarRepuestos()
    .subscribe((resp: any) => {
      resp.repuestos
        .map( (res: any) => {
          this.repuestos = res.storage;
          this.idC = res._id;
        });

      console.log(this.repuestos);
      this.chRef.detectChanges();

      this.dtService.init_tables();

    });

  }

  borrarRepuesto( repuesto: Storage ) {

    const newRepuestos: any[] = [];

    this.repuestos.forEach((repuestos) => {
      if (repuestos._autopart !== repuesto._autopart) {
        newRepuestos.push({
          _id: repuestos._autopart._id,
          stock: repuestos.stock
        });
      }
    });

    const cellar = new AutoCellar(
      '',
      this.idC,
      newRepuestos
    );

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar a ' + repuesto._autopart.code + ' ' + repuesto._autopart.desc,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {
      if (borrar) {

        this.partService.borrarRepuesto(repuesto._autopart._id, cellar)
          .subscribe((borrado: any) => {
            this.dtService.destroy_table();

            this.cargarRepuestos();
          });
      }
    });
  }

}
