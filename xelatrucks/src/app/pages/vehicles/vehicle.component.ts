import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import '../../../assets/vendor/select2/js/select2.js';
import { Make } from '../../models/make.model';
import { MakeService } from '../../services/makes/make.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styles: []
})
export class VehicleComponent implements OnInit, AfterViewInit {

  forma: FormGroup;
  types: any[] = [];
  makes: Make[] = [];

  constructor(
    public makeS: MakeService
  ) { }

    ngAfterViewInit() {
      $('.select2').select2();
      $('.select2').on('change', (e) => this.forma.value.role = $(e.target).val()
      );
    }

    ngOnInit() {
    this.forma = new FormGroup({
      cp: new FormControl(null, Validators.required),
      type: new FormControl(''),
      plate: new FormControl(null, Validators.required),
      no: new FormControl(1),
      make: new FormControl(''),
      model: new FormControl(2001),
      km: new FormControl(0, Validators.min(0)),
      mts: new FormControl(0, Validators.min(0))
    }, {});

    this.types = [{
        type: 'camion',
        text: 'Camión'
    },
    {
      type: 'camionG',
      text: 'Camión gondola'
    },
    {
      type: 'riego',
      text: 'Camión de riego'
    },
    {
      type: 'stock',
      text: 'Vehículo para acomodar materiales'
    },
    {
      type: 'vehiculo',
      text: 'Vehículo '
    }];

    this.cargarMarcas();
  }

  cargarMarcas() {
    this.makeS.cargarMarcas()
    .subscribe( (resp: any) => {
    this.makes = resp.makes;
    });
  }

  crearVehiculo() {

  }

}
