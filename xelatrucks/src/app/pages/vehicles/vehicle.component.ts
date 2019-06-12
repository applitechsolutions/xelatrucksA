import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as $ from 'jquery';
import '../../../assets/vendor/select2/js/select2.js';
import { Make } from '../../models/make.model';
import { MakeService } from '../../services/makes/make.service';
import swal from 'sweetalert';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleService } from '../../services/vehicles/vehicle.service';
import { Router } from '@angular/router';

declare function select2(): any;
@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styles: []
})
export class VehicleComponent implements OnInit, AfterViewInit {

  @ViewChild('close') modalClose: ElementRef;
  @ViewChild('selectT') selectT: ElementRef;
  @ViewChild('selectM') selectM: ElementRef;
  select2: any;

  forma: FormGroup;
  formaMarca: FormGroup;
  types: any[] = [];
  makes: Make[] = [];
  tempMake: string = '';

  constructor(
    public makeS: MakeService,
    public vehicleS: VehicleService,
    public router: Router
  ) { }

  ngAfterViewInit() {
    $('.select2').select2();
  }

  ngOnInit() {
    this.forma = new FormGroup({
      cp: new FormControl(null),
      type: new FormControl(''),
      plate: new FormControl(null, Validators.required),
      no: new FormControl(null),
      make: new FormControl(''),
      model: new FormControl(null),
      km: new FormControl(null),
      mts: new FormControl(null)
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
    console.log(this.selectT.nativeElement.value);
    console.log(this.selectM.nativeElement.value);

    // SELECT VALIDATORS
    this.forma.value.type = this.selectT.nativeElement.value;
    this.forma.value.make = this.selectM.nativeElement.value;

    console.log(this.forma.value);

    if (this.forma.value.type === '' || this.forma.value.make === '') {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    if (this.forma.invalid) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    const vehiculo = new Vehicle (
      this.forma.value.cp,
      this.forma.value.type,
      this.forma.value.make,
      this.forma.value.plate,
      false,
      this.forma.value.no,
      this.forma.value.model,
      this.forma.value.km,
      this.forma.value.mts
    );

    this.vehicleS.crearVehiculo(vehiculo)
    .subscribe( resp => {
      console.log(resp);
      this.router.navigate(['/vehicles']);
    });
  }

}
