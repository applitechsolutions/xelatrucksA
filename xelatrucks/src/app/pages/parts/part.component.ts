import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styles: []
})
export class PartComponent implements OnInit {

  forma: FormGroup;

  constructor() { }

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

    if (this.userArea.length === 0) {
      swal('Oops...', 'Por favor asigna al menos un área', 'warning');
      return;
    }

    const usuario = new User(
      this.forma.value.nombre,
      this.forma.value.correo,
      this.forma.value.password,
      this.forma.value.apel,
      this.forma.value.role,
      this.userArea,
    );

    this._userService.crearUsuario(usuario)
    .subscribe( resp => {
      this.router.navigate(['/usuarios']);
    });

  }

}
