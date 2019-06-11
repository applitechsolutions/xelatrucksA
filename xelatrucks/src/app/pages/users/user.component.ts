import { Component, OnInit, NgModule, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../services/service.index';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';

import swal from 'sweetalert';
import * as $ from 'jquery';
import '../../../assets/vendor/select2/js/select2.js';
import '../../../assets/javascript/theme.js';
import { AreaService } from '../../services/areas/area.service';
import { Area } from '../../models/area.model';

declare function select2(): any;
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styles: []
})
export class UserComponent implements OnInit, AfterViewInit {

  select2: any;
  forma: FormGroup;
  @ViewChild('name') nameField: ElementRef;

  roles: any[] = [];
  areas: Area[] = [];
  area = {
    _id: '',
    nombre: ''
  };
  userArea: Area[] = [];

  constructor(
    public _userService: UserService,
    public router: Router,
    public areaS: AreaService
    ) {
  }

  ngAfterViewInit() {
    $('.select2').select2();
    $('.select2').on('change', (e) => this.forma.value.role = $(e.target).val());
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
    // $('.select2').select2();

    this.forma = new FormGroup({
      nombre: new FormControl(null, Validators.required),
      apel: new FormControl(null),
      correo: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, Validators.required),
      password2: new FormControl(null, Validators.required),
      role: new FormControl('')
    }, { validators: this.sonIguales('password', 'password2')});

    this.roles = [{
      role: 'ADMIN_ROLE',
      texto: 'Admistrador'
      }, {
      role: 'USER_ROLE',
      texto: 'Operativo'
    }];
    this.cargarAreas();
  }

  cargarAreas() {
    this.areaS.cargarAreas()
    .subscribe( (resp: any) => {
    this.areas = resp.areas;
    });
  }

  addArea() {
    if (this.areas && this.area._id) {
      const status: Area = this.areas.find(s => s._id === this.area._id);
      if (status) {
          if (this.userArea.find(e => e._id === status._id)) {
            return;
          } else {
            this.userArea.push({
              _id: status._id,
              name: status.name
            });
          }
      }
    }
  }

  deleteArea(idArea) {
      this.userArea.forEach( (area, index) => {
          if (area._id === idArea) {
            this.userArea.splice(index, 1);
          }
      });
  }

  crearUsuario() {

    console.log(this.forma.valid);
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
