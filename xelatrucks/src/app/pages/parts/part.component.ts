import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { Part } from '../../models/part.model';
import { PartService } from '../../services/parts/part.service';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styles: []
})
export class PartComponent implements OnInit {

  forma: FormGroup;

  constructor(
    public partS: PartService,
    public router: Router,
  ) { }

  ngOnInit() {
    this.forma = new FormGroup({
      code: new FormControl(null, Validators.required),
      desc: new FormControl(null),
      minStock: new FormControl(0, Validators.required)
    }, {});
  }

  crearRepuesto() {

    console.log(this.forma.value.role);

    console.log(this.forma.value);

    if (this.forma.invalid) {
      return;
    }

    const part = new Part(
      this.forma.value.code,
      this.forma.value.desc,
      this.forma.value.minStock,
      false
    );

    this.partS.crearRepuesto(part)
    .subscribe( resp => {
      console.log( resp );
      this.router.navigate(['/parts']);
    });

  }

}
