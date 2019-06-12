import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as $ from 'jquery';
import '../../../assets/vendor/select2/js/select2.js';
import { Make } from '../../models/make.model';
import { MakeService } from '../../services/makes/make.service';
import swal from 'sweetalert';
import { Vehicle } from '../../models/vehicle.model';
import { VehicleService } from '../../services/vehicles/vehicle.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Decimal } from 'src/app/models/decimal.model.js';
import { type } from 'os';

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

  // Variables usadas al ACTUALIZAR vehiculo
  tempType: string = '';
  idVehicle: string = '';

  constructor(
    public makeS: MakeService,
    public vehicleS: VehicleService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe( params => {

      const id = params.id;

      if (id !== 'new') {
        this.cargarVehiculo(id);
      }
    });
   }

  ngAfterViewInit() {
    $('.select2').select2();
  }

  ngOnInit() {
    this.forma = new FormGroup({
      cp: new FormControl(null),
      type: new FormControl(''),
      plate: new FormControl(null, Validators.required),
      no: new FormControl(null),
      model: new FormControl(null),
      km: new FormControl(0),
      mts: new FormControl(0)
    }, {});

    this.formaMarca = new FormGroup({
      name: new FormControl(null, Validators.required)
    }, {});

    this.cargarTypes();
    this.cargarMarcas();
  }

  cargarTypes() {
    this.types = [{
      type: 'camion',
      text: 'Camión'
    }, {
      type: 'camionG',
      text: 'Camión gondola'
    }, {
      type: 'riego',
      text: 'Camión para riego'
    }, {
      type: 'stock',
      text: 'Excavadora'
    }, {
      type: 'vehiculo',
      text: 'Vehículo '
    }];
  }

  cargarMarcas() {
    this.makeS.cargarMarcas()
    .subscribe( (resp: any) => {
    this.makes = resp.makes;
    });
  }

  cargarVehiculo( id: string ) {
      this.vehicleS.cargarVehiculo( id )
        .subscribe( resp => {
        this.idVehicle = resp._id;
        this.forma.get('cp').setValue(resp.cp);
        this.tempType = resp.type;
        this.forma.get('type').setValue(resp.type);
        this.cargarTypes();
        this.tempMake = resp._make._id;
        this.forma.get('plate').setValue(resp.plate);
        this.forma.get('no').setValue(resp.no);
        this.forma.get('model').setValue(resp.model);
        this.forma.get('mts').setValue(resp.mts.$numberDecimal);
        this.forma.get('km').setValue(resp.km.$numberDecimal);
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

    const make: Make = {
      _id: this.selectM.nativeElement.value,
      name: ''
    };
    const km: Decimal = {
        $numberDecimal: this.forma.value.km
    }
    const mts: Decimal = {
      $numberDecimal: this.forma.value.mts
    }

    // SELECT VALIDATORS
    this.forma.value.type = this.selectT.nativeElement.value;

    console.log(this.forma.value);

    if (this.forma.value.type === '' || make._id === '') {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    if (this.forma.invalid) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    if (this.idVehicle === '') {
      console.log('nuevo');
      const vehiculo = new Vehicle (
        this.forma.value.type,
        make,
        this.forma.value.plate,
        false,
        this.forma.value.cp,
        this.forma.value.no,
        this.forma.value.model,
        km,
        mts
      );

      this.vehicleS.crearVehiculo(vehiculo)
      .subscribe( resp => {
        console.log(resp);
        this.router.navigate(['/vehicles']);
      });
    } else {
      const vehiculo = new Vehicle (
        this.forma.value.type,
        make,
        this.forma.value.plate,
        false,
        this.forma.value.cp,
        this.forma.value.no,
        this.forma.value.model,
        km,
        mts,
        this.idVehicle
      );
      
      this.vehicleS.crearVehiculo(vehiculo)
      .subscribe( resp => {
        console.log(resp);
        this.router.navigate(['/vehicles']);
      });
    }
  }

}
