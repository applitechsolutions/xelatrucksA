import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  DatatablesService,
  DestinationService,
  MaterialService,
  OrderService,
  PullService
} from 'src/app/services/service.index';
import { Destination } from '../../models/destination.model';
import { StorageMaterial } from 'src/app/models/storageMaterial.model';
import { Material } from 'src/app/models/material.model';
import { Pull } from '../../models/pull.model';
import { Order } from '../../models/order.model';

import * as $ from 'jquery';
import * as moment from 'moment/moment';
import { Router } from '@angular/router';
declare var swal: any;

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styles: []
})
export class OrderComponent implements OnInit, AfterViewInit {

  @ViewChild('closeMMt', { static: false }) closeMMt: ElementRef;
  @ViewChild('selectM', { static: false }) selectM: ElementRef;
  @ViewChild('selectD', { static: false }) selectD: ElementRef;
  @ViewChild('date', { static: false }) date: ElementRef;

  loading = false;

  order: Order = {
    _destination: null,
    date: '',
    order: ''
  };

  destinations: Destination[] = [];

  pulls: Pull[] = [];
  pull: Pull = { _order: null, _material: null, mts: 0, totalMts: 0, kg: 0, totalKg: 0 };
  totalMts = 0;
  totalKgs = 0;

  materials: StorageMaterial[] = [];
  material: Material = { code: '', name: '', minStock: 0 };
  formMat: FormGroup;
  tempMat: string = '';

  constructor(
    public dtS: DatatablesService,
    public destinationS: DestinationService,
    public materialS: MaterialService,
    public orderS: OrderService,
    public pullS: PullService,
    public router: Router
  ) { }

  ngOnInit() {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtS.init_datePicker(today);

    this.formMat = new FormGroup({
      code: new FormControl(null),
      name: new FormControl(null, Validators.required),
      minStock: new FormControl(null, Validators.required)
    });

    this.cargarDestinos();
    this.cargarMateriales();
  }

  ngAfterViewInit() {
    $('.select2').select2();
  }

  cargarDestinos() {
    this.destinationS.cargarDestinos()
      .subscribe((resp: any) => {
        this.destinations = resp.destinos;
      });
  }

  cargarMateriales() {
    this.materialS.cargarMateriales()
      .subscribe((res: any) => {
        res.materiales
          .map((resp: any) => {
            this.materials = resp.storage;
          });
        // console.log(this.materials);
      });
  }

  crearOrden() {
    const fecha = moment(this.date.nativeElement.value, 'DD/MM/YYYY').toDate();

    if (this.selectD.nativeElement.value === '' || this.order.order === '' || this.date.nativeElement.value === '') {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    if (this.pulls.length === 0) {
      swal('Oops...', 'Debe agregar materiales al detalle', 'warning');
      return;
    }
    this.loading = true;

    this.order._destination = this.selectD.nativeElement.value;
    this.order.date = fecha.toString();

    this.orderS.crearOrden(this.order)
      .subscribe(resp => {
        const orderDB: Order = resp.orden;
        let itemsProcessed = 0;

        this.pulls.forEach(element => {

          const pull: Pull = {
            _order: orderDB,
            _material: element._material,
            mts: 0,
            totalMts: element.totalMts,
            kg: 0,
            totalKg: element.totalKg
          };

          this.pullS.crearPull(pull)
            .subscribe(resp => {
              itemsProcessed++;

              console.log(itemsProcessed);
              console.log(this.pulls.length);

              if (itemsProcessed === this.pulls.length) {
                swal('Orden creada', 'Pull de materiales creado correctamente', 'success');
                this.loading = false;
                this.router.navigate(['/orders']);
              }
            });
        });
      });
  }

  agregarDetalle() {
    if (this.selectM.nativeElement.value === '' || this.pull.totalMts <= 0 || this.pull.totalKg <= 0) {
      swal('Oops...', 'Por favor ingrese los campos obligatorios y válidos', 'warning');
      return;
    }

    if (this.pulls.find(e => e._material._id === this.selectM.nativeElement.value)) {
      // Pull existente
      const pull = this.pulls.find(e => e._material._id === this.selectM.nativeElement.value);
      // Index del pull existente
      const index = this.pulls.findIndex(e => e._material._id === this.selectM.nativeElement.value);
      // Recalcular el total de mts y kg
      this.pull.totalMts = pull.totalMts + this.pull.totalMts;
      this.pull.totalKg = pull.totalKg + this.pull.totalKg;
      this.pull._material = pull._material;
      console.log(this.pull);
      // Remplazamos el pull por el nuevo recalculado
      this.pulls.splice(index, 1, this.pull);
    } else {
      const material = this.materials.find(e => e._material._id === this.selectM.nativeElement.value);
      this.pull._material = material._material;
      this.pulls.push({
        _order: null,
        _material: this.pull._material,
        mts: 0,
        totalMts: this.pull.totalMts,
        kg: 0,
        totalKg: this.pull.totalKg
      });
    }

    this.calcularTotales();
    swal({
      title: '¡Agregado!',
      text: 'Material agregado al detalle',
      icon: 'success',
      button: false,
      timer: 1000
    });
    this.pull = { _order: null, _material: null, mts: 0, totalMts: 0, kg: 0, totalKg: 0 };
  }

  quitarDetalle(id: string) {

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar un registro del detalle',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          // BUSCAMOS EL INDEX en el que se encuentra el item a eliminar
          const index = this.pulls.findIndex(item => item._material._id === id);

          // ELIMINAMOS EL DETALLE en base al index encontrado
          this.pulls.splice(index, 1);
          this.calcularTotales();
        }
      });
  }

  calcularTotales() {
    // SUMAS PARA LOS TOTAL DE MTRS Y KG CONSUMIDOS -------------
    this.totalMts = this.pulls.reduce((sum, item) => sum + item.totalMts, 0);
    this.totalKgs = this.pulls.reduce((sum, item) => sum + item.totalKg, 0);
    // ------------
  }

  crearMaterial() {
    // console.log(this.formMat.value);
    // console.log(this.formMat.valid);

    if (this.formMat.invalid) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    const material = new Material(
      this.formMat.value.code,
      this.formMat.value.name,
      this.formMat.value.minStock
    );

    this.materialS.crearMaterial(material)
      .subscribe((res: any) => {
        swal({
          title: 'Exito!',
          text: 'Material creado correctamente' + res.material.code + ' ' + res.material.name,
          icon: 'success',
          button: false,
          timer: 1500
        });

        this.tempMat = res.material._id;
        this.formMat.reset();
        this.closeMMt.nativeElement.click();
        this.cargarMateriales();

      });

  }
}
