import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Part } from '../../models/part.model';
import { PartService } from '../../services/service.index';
import swal from 'sweetalert';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styles: []
})
export class PartComponent implements OnInit {

  forma: FormGroup;
  repuesto: Part = new Part('', '', 0, false);
  idC: string;

  constructor(public partS: PartService, public router: Router, public activatedRoute: ActivatedRoute ) {

    activatedRoute.params.subscribe( params => {

      const id = params.id;

      if (id !== 'new') {
        this.cargarRepuesto(id);
      }
    });
  }

  ngOnInit() {
    this.forma = new FormGroup({
      code: new FormControl(null, Validators.required),
      desc: new FormControl(null),
      minStock: new FormControl(0, Validators.required)
    }, {});
  }

  cargarRepuesto( id: string ) {
    this.partS.cargarRepuesto(id)
      .subscribe(repuesto => {
        this.repuesto = repuesto;
        this.forma.get('code').setValue(this.repuesto.code);
        this.forma.get('desc').setValue(this.repuesto.desc);
        this.forma.get('minStock').setValue(this.repuesto.minStock);
      });
  }

  crearRepuesto() {

    // console.log(this.forma.value.role);

    // console.log(this.forma.value);

    if (this.forma.invalid) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    let part;

    if (this.repuesto._id) {

      part = new Part(
        this.forma.value.code,
        this.forma.value.desc,
        this.forma.value.minStock,
        false,
        this.repuesto._id
      );

    } else {
      part = new Part(
        this.forma.value.code,
        this.forma.value.desc,
        this.forma.value.minStock,
        false
      );
    }

    this.partS.crearRepuesto(part)
      .subscribe( resp => {
        // console.log( resp );
        this.router.navigate(['/parts']);
      });

  }

}
