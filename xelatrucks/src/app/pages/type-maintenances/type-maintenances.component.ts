import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TypeMaintenanceService } from 'src/app/services/service.index';
import { TypeMaintenance } from '../../models/typeMaintenance.model';

declare var swal: any;
@Component({
  selector: 'app-type-maintenances',
  templateUrl: './type-maintenances.component.html',
  styles: []
})
export class TypeMaintenancesComponent implements OnInit {

  typeMaintenances: TypeMaintenance[] = [];
  forma: FormGroup;
  idTypeMaintenance: string;
  editando: boolean = false;

  constructor(
    public typeS: TypeMaintenanceService
  ) { }

  ngOnInit() {
    this.forma = new FormGroup({
      name: new FormControl('', Validators.required)
    }, {});
    this.cargarTipos();
  }

  cargarTipos() {
    this.typeS.cargarTipos()
      .subscribe( (resp: any) => {
        this.typeMaintenances = resp.tipos;
      });
  }

  cargarTipo( id: string ) {
    this.typeS.cargarTipo( id )
      .subscribe( resp => {
        this.idTypeMaintenance = resp._id;
        this.forma.get('name').setValue(resp.name);
        this.editando = true;
      });
  }

  crearTipo() {
    // console.log(this.forma.invalid);
    // console.log(this.forma.value);

    if (this.forma.invalid) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    if (this.idTypeMaintenance === '') {
      const typeMaintenance = new TypeMaintenance(
        this.forma.value.name,
        false
      );

      this.typeS.crearTipo( typeMaintenance )
        .subscribe( resp => {
          // console.log(resp);
          this.cargarTipos();
        });
    } else {
      const typeMaintenance = new TypeMaintenance(
        this.forma.value.name,
        false,
        this.idTypeMaintenance
      );

      this.typeS.crearTipo( typeMaintenance )
        .subscribe( resp => {
          // console.log(resp);
          this.cargarTipos();
          this.idTypeMaintenance = '';
          this.editando = false;
        });
    }
    this.forma.reset();
  }

  borrarTipo( typeMaintenance: TypeMaintenance ) {

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar a ' + typeMaintenance.name,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {
      if (borrar) {
        this.typeS.borrarTipo( typeMaintenance._id )
          .subscribe( (borrado: any) => {

            this.cargarTipos();
          });
      }
    });
  }

}
