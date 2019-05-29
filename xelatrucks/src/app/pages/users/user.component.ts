import { Component, OnInit, NgModule } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService, DynamicScriptLoaderServiceService } from '../../services/service.index';
import { User } from '../../models/user.model';

import * as $ from 'jquery';
import '../../../assets/vendor/select2/js/select2.js';

declare function select2(): any;
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: []
})
export class UserComponent implements OnInit {

  select2: any;
  forma: FormGroup;

  constructor( public _userService: UserService,) {
    
  }

  sonIguales( campo1: string, campo2: string) {

    return ( group: FormGroup ) => {

      const pass1 = group.controls[campo1].value;
      const pass2 = group.controls[campo2].value;

      if (pass1 === pass2) {
        return null;
      }

      return {
        sonIguales: true
      };
    };

  }

  ngOnInit() {

    $('.select2').select2();

    this.forma = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      apel: new FormControl(null),
      correo: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, Validators.required),
      password2: new FormControl(null, Validators.required),
      role: new FormControl('ADMIN_ROLE')
    }, { validators: this.sonIguales('password', 'password2')});
  }

  crearUsuario() {

    console.log(this.forma.valid);

    if (this.forma.invalid) {
      return;
    }

    const usuario = new User(
      this.forma.value.nombre,
      this.forma.value.correo,
      this.forma.value.password,
      this.forma.value.apel,
      this.forma.value.role,
    );

    this._userService.crearUsuario(usuario)
    .subscribe( resp => {
      console.log(resp);
    });
  }

}
