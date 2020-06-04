import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Sale } from '../../models/sale.model';
import { Customer } from '../../models/customer.model';
import { StorageMaterial } from '../../models/storageMaterial.model';
import { Material } from '../../models/material.model';
import { DetailSale } from '../../models/detailSale.model';
import { SaleService, MaterialService, CustomerService, DatatablesService } from "../../services/service.index";
import * as $ from 'jquery';
import * as moment from 'moment/moment';
import '../../../assets/vendor/select2/js/select2.js';

declare var swal: any;

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styles: []
})
export class SaleComponent implements OnInit {

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

  loading: boolean = false;
  isSalable: boolean = false;

  constructor(
    public router: Router,
    public saleService: SaleService,
    public matService: MaterialService,
    public custService: CustomerService,
    public dtService: DatatablesService
  ) { }

  ngOnInit() {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);
    this.dtService.init_timePicker();

    this.formVenta = new FormGroup({
      customer: new FormControl(''),
      noBill: new FormControl(''),
      document: new FormControl(''),
      flete: new FormControl(0, Validators.required),
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
  }

  ngAfterViewInit() {
    $('.select2').select2();
  }

  cargarModal(material: StorageMaterial) {
    this.detail.material = material._material;

    if (material.stock <= material._material.minStock) {
      this.formDetalle.disable();
      this.isSalable = true;
    } else {
      this.formDetalle.enable();
      this.isSalable = false;
    }
  }

  agregarDetalle() {
    this.details.push({
      material: this.detail.material,
      total: this.formDetalle.value.total,
      price: this.formDetalle.value.price
    });

    this.formVenta.value.total = this.details.map((detail) => {
      return detail.price
    }).reduce((prev, curr) => {
      return prev + curr
    });

    console.log(this.formVenta.value.total);
    this.closeMD.nativeElement.click();
    this.formDetalle.reset();
  }

  quitarDetalle(detalle: DetailSale) {
    console.log(detalle);
  }

  crearVenta() {
    if (!this.formVenta.valid || this.selectC.nativeElement.value === '') {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    this.loading = true;

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
      );

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
          .map((res: any) => {
            this.materials = res.storage
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
