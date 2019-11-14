import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as $ from 'jquery';
import '../../../assets/vendor/select2/js/select2.js';
import { DetailsSpare } from '../../models/detailsSpare.model';
import { Storage } from '../../models/storage';
import { PartService, AutoProviderService, BuySpareService} from '../../services/service.index';
import { Part } from '../../models/part.model';
import { Router } from '@angular/router';
import { BuySpare } from '../../models/buySpare.model';
import { DatatablesService } from '../../services/datatables/datatables.service';
import { AutoProvider } from '../../models/autoProvider.model';
import * as moment from 'moment/moment';

declare var swal: any;
declare function select2(): any;
@Component({
  selector: 'app-buy-spare',
  templateUrl: './buy-spare.component.html',
  styles: []
})
export class BuySpareComponent implements OnInit, AfterViewInit {

  @ViewChild('closeP', {static: false}) modalClose: ElementRef;
  @ViewChild('selectR', {static: false}) selectR: ElementRef;
  @ViewChild('selectP', {static: false}) selectP: ElementRef;
  @ViewChild('date', {static: false}) date: ElementRef;

  forma: FormGroup;
  formaR: FormGroup;
  providers: AutoProvider[] = [];
  storages: Storage[] = [];
  details: DetailsSpare[] = [];
  detail: DetailsSpare = {
    _part: { code: '', desc: '', minStock: 0, state: false, _id: '' },
    quantity: null,
    cost: null
  };
  tempPart: string = '';

  constructor(
    public partS: PartService,
    public providerS: AutoProviderService,
    public router: Router,
    public buySpareS: BuySpareService,
    public dtS: DatatablesService
  ) { }

  ngAfterViewInit() {
    $('.select2').select2();
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtS.init_datePicker(today);
  }

  ngOnInit() {
    this.forma = new FormGroup({
      provider: new FormControl(''),
      noBill: new FormControl(null),
      serie: new FormControl(null),
      noDoc: new FormControl(null),
      discount: new FormControl(0, Validators.required),
      total: new FormControl(0, Validators.required)
    }, {});

    this.formaR = new FormGroup({
      codeP: new FormControl(null, Validators.required),
      descriptionP: new FormControl(null),
      minStock: new FormControl(0, Validators.required)
    }, {});

    this.getProviders();
    this.getStorages();
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtS.init_datePicker(today);
  }

  getProviders() {
    this.providerS.cargarProveedores()
      .subscribe( (resp: any) => {
        this.providers = resp.proveedores;
        console.log(this.providers);
      });
  }

  getStorages() {
    this.partS.cargarRepuestos()
      .subscribe( (resp: any) => {
        resp.repuestos
        .map( (res: any) => {
          this.storages = res.storage;
          // console.log(this.storages.map( (resp: any) => resp._autopart ));
        });
      });
  }

  crearRepuesto() {
    // console.log(this.formaR.value.role);

    // console.log(this.formaR.value);

    if (this.formaR.invalid) {
      return;
    }

    const part = new Part(
      this.formaR.value.codeP,
      this.formaR.value.descriptionP,
      this.formaR.value.minStock,
      false
    );

    this.partS.crearRepuesto(part)
      .subscribe( resp => {
        // console.log( resp );
        const repuestoDB = resp.repuesto;
        this.tempPart = repuestoDB._id;
        this.getStorages();
        this.formaR.reset();
        this.modalClose.nativeElement.click();
      });
  }

  AgregarDetalle() {
    if (this.selectR.nativeElement.value === '' || this.detail.quantity === null || this.detail.cost === null) {
      swal('Oops...', 'Por favor ingrese los campos obligatorios', 'warning');
      return;
    }
    if (this.details.find(e => e._part._id === this.selectR.nativeElement.value)) {
      const row = this.details.find(e => e._part._id === this.selectR.nativeElement.value);
      const index = this.details.findIndex(e => e._part._id === this.selectR.nativeElement.value);
      // RESTAR EL SUBTOTAL AL TOTAL DEL RESGISTRO YA EXISTENTE
      this.forma.get('total').setValue(this.forma.value.total - (row.quantity * row.cost));
      // RECALCULO LA CANTIDAD Y EL SUBTOTAL
      this.detail.quantity = row.quantity + this.detail.quantity;
      this.detail._part = row._part;
      // REMPLAZAMOS EL REPUESTO en base al index encontrado
      this.details.splice(index, 1, this.detail);
    } else {
      const part = this.storages.find(e => e._autopart._id === this.selectR.nativeElement.value);
      this.detail._part = part._autopart;
      this.details.push({
      _part: this.detail._part,
      quantity: this.detail.quantity,
      cost: this.detail.cost
      });
    }
    // SUMAR AL TOTAL
    this.forma.get('total').setValue(this.forma.value.total + (this.detail.quantity * this.detail.cost));

    swal({
      title: '¡Agregado!',
      text: 'Repuesto agregado al detalle',
      icon: 'success',
      button: false,
      timer: 1000
    });
    this.detail = {
    _part: { code: '', desc: '', minStock: 0, state: false, _id: '' },
     quantity: null,
     cost: null
   };
  }

  quitarDetalle( id: string ) {
    // console.log('BORRANDO...');
    // console.log(this.details);
    // BUSCAMOS EL INDEX en el que se encuentra el item a editar dentro del arreglo de basics
    const index = this.details.findIndex(item => item._part._id === id);

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar un registro del detalle, esto afectará el total de la compra',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {
      if (borrar) {
        // BUSCAMOS LA FILA DENTRO DEL ARREGLO PARA TENER LOS DATOS
        const row = this.details.find(e => e._part._id === id);
        // ACTUALIZAMOS el total
        this.forma.get('total').setValue(this.forma.value.total - (row.quantity * row.cost));

        // ELIMINAMOS EL DETALLE en base al index encontrado
        this.details.splice(index, 1);

      }
    });
  }

  crearCompra() {

    // SELECT VALIDATORS
    this.forma.get('provider').setValue(this.selectP.nativeElement.value);
    const fecha = moment(this.date.nativeElement.value, 'DD/MM/YYYY').toDate();

    // console.log(this.forma.value);
    // console.log('ESTAMOS EN CREAR COMPRA');

    if (this.forma.value.provider === '' || this.forma.value.total === 0) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    if (this.forma.invalid) {
      swal('Oops...', 'Algunos campos son obligatorios invalid', 'warning');
      return;
    }

    const provider: AutoProvider = {

      _id: this.forma.value.provider,
      name: '',
      state: false
    };

    const buySpare = new BuySpare (
       provider,
       fecha.toString(),
       this.forma.value.discount,
       this.forma.value.total,
       false,
       this.forma.value.noBill,
       this.forma.value.serie,
       this.forma.value.noDoc,
       this.details
    );

    this.buySpareS.crearCompra( buySpare )
    .subscribe( resp => {
      // console.log(resp);
      this.router.navigate(['/buySpares']);
    });
  }
}
