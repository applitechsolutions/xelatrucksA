import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as $ from 'jquery';
import '../../../assets/vendor/select2/js/select2.js';
import { Make } from '../../models/make.model';
import { MakeService } from '../../services/makes/make.service';

declare function select2(): any;
@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styles: []
})
export class VehicleComponent implements OnInit, AfterViewInit {

  @ViewChild('close') modalClose: ElementRef;
  select2: any;

  forma: FormGroup;
  formaMarca: FormGroup;
  types: any[] = [];
  makes: Make[] = [];
  tempMake: string = '';

  constructor(
    public makeS: MakeService
  ) { }

  ngAfterViewInit() {
    $('.select2').select2();
    $('.select2').on('change', (e) => this.forma.value.make = $(e.target).val());
  }

  ngOnInit() {
    this.forma = new FormGroup({
      cp: new FormControl(null, Validators.required),
      type: new FormControl('', Validators.required),
      plate: new FormControl(null, Validators.required),
      no: new FormControl(null),
      make: new FormControl(''),
      model: new FormControl(null),
      km: new FormControl(null, Validators.min(0)),
      mts: new FormControl(null, Validators.min(0))
    }, {});

    this.formaMarca = new FormGroup({
      name: new FormControl(null, Validators.required)
    }, {});

    this.types = [{
      type: 'camion',
      text: 'Camión'
    }, {
      type: 'camionG',
      text: 'Camión gondola'
    }, {
      type: 'riego',
      text: 'Camión de riego'
    }, {
      type: 'stock',
      text: 'Vehículo para acomodar materiales'
    }, {
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

  crearMarca() {
    console.log(this.formaMarca.valid);
    console.log(this.formaMarca.value);

    if (this.formaMarca.invalid) {
      return;
    }

    const make = new Make (
          this.formaMarca.value.name
    );

    this.makeS.crearMarca( make )
        .subscribe( (resp: any) => {
          console.log( resp );
          const marcaDB = resp.marca;
          this.forma.value.make = marcaDB._id;
          this.tempMake = marcaDB._id;
          this.cargarMarcas();
          this.modalClose.nativeElement.click();
        });
  }

  crearVehiculo() {
      console.log(this.forma.value);
  }

}
