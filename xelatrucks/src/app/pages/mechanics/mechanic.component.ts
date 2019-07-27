import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MechanicService } from '../../services/service.index';
import { Mechanic } from '../../models/mech.model';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert';

@Component({
  selector: 'app-mechanic',
  templateUrl: './mechanic.component.html',
  styles: []
})
export class MechanicComponent implements OnInit {

  formaMech: FormGroup;
  mech: Mechanic = new Mechanic('', '', false);

  constructor(public router: Router, public mechService: MechanicService, public activatedRoute: ActivatedRoute) {

    activatedRoute.params.subscribe( params => {

      const id = params.id;

      if (id !== 'new') {
        this.cargarMecanico(id);
      }

    });
  }

  ngOnInit() {
    this.formaMech = new FormGroup({
      code: new FormControl(null),
      name: new FormControl(null, Validators.required)
    });
  }

  cargarMecanico( id: string ) {

    this.mechService.cargarMecanico( id )
      .subscribe( mecanico => {

        this.mech = mecanico;
        this.formaMech.get('code').setValue(this.mech.code);
        this.formaMech.get('name').setValue(this.mech.name);

      });
  }

  crearMech() {

    console.log(this.formaMech.value);

    if (this.formaMech.invalid) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    let mech;

    if (this.mech._id) {
      mech = new Mechanic(
        this.formaMech.value.code,
        this.formaMech.value.name,
        false,
        this.mech._id
      );
    } else {
      mech = new Mechanic(
        this.formaMech.value.code,
        this.formaMech.value.name,
        false
      );
    }

    this.mechService.crearMecanico(mech)
      .subscribe( res => {
        this.router.navigate(['/mechs']);
      });
  }

}
