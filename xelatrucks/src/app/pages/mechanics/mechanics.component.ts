import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Mechanic } from '../../models/mech.model';
import { DatatablesService, MechanicService } from '../../services/service.index';

declare var swal: any;

@Component({
  selector: 'app-mechanics',
  templateUrl: './mechanics.component.html',
  styles: []
})
export class MechanicsComponent implements OnInit {

  mechs: Mechanic[] = [];

  constructor(public dtService: DatatablesService, public mechService: MechanicService, private chRef: ChangeDetectorRef) { }

  ngOnInit() {
    this.cargarMechs();
  }

  cargarMechs() {
    this.mechService.cargarMecanicos()
      .subscribe( (res: any) => {
        this.mechs = res.mecanicos;
        this.dtService.destroy_table();
        this.chRef.detectChanges();
        this.dtService.init_tables();
      });
  }

  borrarMech( mechanic: Mechanic ) {

    mechanic.state = true;

    console.log(mechanic);

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar a ' + mechanic.name,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {
      if (borrar) {

        this.mechService.borrarMecanico(mechanic)
          .subscribe( borrado => {
            console.log(borrado);
            this.cargarMechs();
          });
      }

    });

  }

}