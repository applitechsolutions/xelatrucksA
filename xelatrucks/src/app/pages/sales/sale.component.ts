import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  SaleService,
  MaterialService,
  CustomerService,
  DatatablesService,
  UserService
} from '../../services/service.index';
import { Sale } from '../../models/sale.model';
import { Customer } from '../../models/customer.model';
import { StorageMaterial } from '../../models/storageMaterial.model';
import { Material } from '../../models/material.model';
import { DetailSale } from '../../models/detailSale.model';

import PerfectScrollbar from 'perfect-scrollbar';
import * as $ from 'jquery';
import * as moment from 'moment/moment';
import '../../../assets/vendor/select2/js/select2.js';
import { } from 'src/app/services/service.index';
declare var swal: any;

// IMPRESIONES
declare function init_despacho();

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styles: []
})
export class SaleComponent implements OnInit, AfterViewInit {

  @ViewChild('scroll') scroll: ElementRef; // id para PerfectScrollBar
  @ViewChild('date') date: ElementRef;
  @ViewChild('selectC') selectC: ElementRef;
  @ViewChild('closeMD') closeMD: ElementRef;
  @ViewChild('closeMMt') closeMMt: ElementRef;
  @ViewChild('closeMC') closeMC: ElementRef;

  formVenta: FormGroup;
  formDetalle: FormGroup;
  formCliente: FormGroup;

  sale: Sale = { _customer: null, date: null, state: false, total: 0 };
  details: DetailSale[] = [];
  detail: DetailSale = { material: { code: '', name: 'undefined', minStock: 0, price: 0 }, total: 0, price: 0 };
  customers: Customer[] = [];

  materials: StorageMaterial[] = [];

  total: number = 0;
  flete: number = 0;
  loading: boolean = false;
  isSalable: boolean = false;

  constructor(
    public router: Router,
    public saleService: SaleService,
    public matService: MaterialService,
    public custService: CustomerService,
    public dtService: DatatablesService,
    public userS: UserService,
    public chRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.dtService.init_timePicker();

    this.formVenta = new FormGroup({
      customer: new FormControl(''),
      noBill: new FormControl(''),
      document: new FormControl(''),
      flete: new FormControl(0),
      total: new FormControl(0, Validators.required)
    }, {});

    this.formDetalle = new FormGroup({
      total: new FormControl(0, Validators.required),
      price: new FormControl(0, Validators.required)
    }, {});

    this.formCliente = new FormGroup({
      name: new FormControl(null, Validators.required),
      nit: new FormControl(null),
      address: new FormControl('Ciudad'),
      mobile: new FormControl('00000000')
    }, {});

    this.cargarMateriales();
    this.cargarClientes();
    this.cargarCorrelativo();
  }

  ngAfterViewInit() {
    $('.select2').select2();
    // SE CAMBIO aqui por la condicion si es 'ADMIN_ROLE' o no!
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);
  }

  cargarCorrelativo() {
    this.saleService.cargarCorrelativo().subscribe(sale => {
      this.formVenta.get('noBill').setValue(+sale.bill + 1);
      this.formVenta.get('document').setValue(+sale.serie + 1);
    });
  }

  cargarModal(material: StorageMaterial) {
    this.detail.material = material._material;
    this.formDetalle.get('price').setValue(material._material.price);

    if (material.stock <= material._material.minStock) {
      this.formDetalle.disable();
      this.isSalable = true;
    } else {
      this.formDetalle.enable();
      this.isSalable = false;
    }
  }

  agregarDetalle() {

    // Descontanmos la cantidad del STOCK disponible en este momento
    const storageMaterial = this.materials.find(e => e._material._id === this.detail.material._id);
    const indexStorageMaterial = this.materials.findIndex(e => e._material._id === this.detail.material._id);
    storageMaterial.stock = +storageMaterial.stock - +this.formDetalle.value.total;
    this.materials.splice(indexStorageMaterial, 1, storageMaterial);

    this.details.push({
      material: this.detail.material,
      total: this.formDetalle.value.total,
      price: this.formDetalle.value.price
    });

    this.total = this.flete + this.details.map((detail) => {
      return detail.price * detail.total;
    }).reduce((prev, curr) => {
      return prev + curr;
    });

    this.closeMD.nativeElement.click();
    this.formDetalle.reset();
  }

  quitarDetalle(detalle: DetailSale) {
    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar un registro del detalle, esto afectará el total de la venta',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {

          const index = this.details.findIndex(item => item.material && item.material._id === detalle.material._id);
          const material = this.details.find(e => e.material && e.material._id === detalle.material._id);
          // BUSCAMOS EL MATERIAL DENTRO DEL ARREGLO PARA TENER LOS DATOS

          this.total -= material.price * material.total;

          // ELIMINAMOS EL DETALLE en base al index encontrado
          this.details.splice(index, 1);

          // Sumamos la cantidad a el STOCK disponible en este momento
          const storageMaterial = this.materials.find(e => e._material._id === detalle.material._id);
          const indexStorageMaterial = this.materials.findIndex(e => e._material._id === detalle.material._id);
          storageMaterial.stock = +storageMaterial.stock + +detalle.total;
          this.materials.splice(indexStorageMaterial, 1, storageMaterial);
        }
      });
  }

  cambiarTotal(event: any) {

    if (event.target.value === '' && this.total === 0) {
      this.total = 0;
    } else if (this.total === 0) {
      this.total += Number(event.target.value);
    } else if (this.total > 0 && event.target.value !== '') {
      this.total -= this.flete;
      this.total += Number(event.target.value);
    }

    if (event.target.value === '' && this.total > 0) {
      this.total -= this.flete;
      this.flete = 0;
    } else {
      this.flete = Number(event.target.value);
    }

  }

  crearVenta() {
    if (!this.formVenta.valid || this.selectC.nativeElement.value === '') {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    if (this.total <= 0) {
      swal('Oops...', 'No puede guardar una venta en Q 0.00', 'warning');
      return;
    }

    document.documentElement.scrollTop = document.body.scrollTop = 0; // SIRVE PARA QUE LAS IMPRESIONES SALGAN CORRECTAMENTE
    this.loading = true;
    this.formVenta.get('total').setValue(this.total);

    if (this.sale._id) {
      return;
    } else {
      const sale = new Sale(
        this.selectC.nativeElement.value,
        moment(this.date.nativeElement.value, 'DD/MM/YYYY').toDate(),
        false,
        this.formVenta.value.total,
        this.formVenta.value.document,
        this.formVenta.value.noBill,
        this.details,
        this.formVenta.value.flete,
      );
      // this.sale = sale;
      // this.chRef.detectChanges(); // IMPRESION DE ORDEN DE DESPACHO
      // init_despacho();

      this.saleService.crearVenta(sale)
        .subscribe((res: any) => {
          this.loading = false;
          this.router.navigate(['/sales']);
        }, (err) => {
          console.log(err);
          this.loading = false;
        });
    }
  }

  /* #region  colecciones externas */
  cargarMateriales() {
    this.matService.cargarMateriales()
      .subscribe((res: any) => {
        res.materiales
          .map((resp: any) => {
            this.materials = resp.storage;
            const ps = new PerfectScrollbar(this.scroll.nativeElement);
          });
      });
  }

  recibirMaterial(material: Material) {
    // this.materials.push(material);
    console.log(material);
    this.cargarMateriales();
  }

  cargarClientes() {
    this.custService.cargarClientes()
      .subscribe((res: any) => {
        this.customers = res.clientes;
      });
  }

  crearCliente() {
    if (this.formCliente.invalid) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    const customer = new Customer(
      this.formCliente.value.name,
      false,
      this.formCliente.value.nit,
      this.formCliente.value.address,
      this.formCliente.value.mobile
    );

    this.custService.crearCliente(customer)
      .subscribe(resp => {
        this.cargarClientes();
        this.closeMC.nativeElement.click();
      });
    this.formCliente.reset();
    this.formCliente.get('address').setValue('Quetzaltenango');
    this.formCliente.get('mobile').setValue('00000000');
  }
  /* #endregion */

}
