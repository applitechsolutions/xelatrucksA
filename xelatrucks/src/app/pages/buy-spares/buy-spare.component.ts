import { Component, OnInit, AfterViewInit, Provider, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as $ from 'jquery';
import '../../../assets/vendor/select2/js/select2.js';
import swal from 'sweetalert';
import { DetailsSpare } from '../../models/detailsSpare.model';
import { Storage } from '../../models/storage';
import { PartService } from '../../services/parts/part.service';
import { Part } from '../../models/part.model';
import { AutoProviderService } from '../../services/autoProviders/auto-provider.service';
import { Router } from '@angular/router';

declare function select2(): any;
@Component({
  selector: 'app-buy-spare',
  templateUrl: './buy-spare.component.html',
  styles: []
})
export class BuySpareComponent implements OnInit, AfterViewInit {

  @ViewChild('closeP') modalClose: ElementRef;
  @ViewChild('selectR') selectR: ElementRef;

  forma: FormGroup;
  formaR: FormGroup;
  providers: Provider[] = [];
  storages: Storage[] = [];
  details: DetailsSpare[] = [];
  detail: DetailsSpare = {
    _part: { code: '', desc: '', minStock: 0, state: false, _id: '' },
    quantity: null,
    cost: { $numberDecimal: null }
  };
  tempPart: string = '';

  constructor(
    public partS: PartService,
    public providerS: AutoProviderService,
    public router: Router
  ) { }

  ngAfterViewInit() {
    $('.select2').select2();
  }

  ngOnInit() {
    this.forma = new FormGroup({
      date: new FormControl(null, Validators.required),
      provider: new FormControl(''),
      noBill: new FormControl(null),
      serie: new FormControl(null),
      noDoc: new FormControl(null)
    }, {});

    this.formaR = new FormGroup({
      codeP: new FormControl(null, Validators.required),
      descriptionP: new FormControl(null),
      minStock: new FormControl(0, Validators.required)
    }, {});

    this.getProviders();
    this.getStorages();
  }

  getProviders() {
    this.providerS.cargarProveedores()
      .subscribe( (resp: any) => {
        this.providers = resp.proveedores;
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
    console.log(this.formaR.value.role);

    console.log(this.formaR.value);

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
        console.log( resp );
        const repuestoDB = resp.repuesto;
        this.tempPart = repuestoDB._id;
        this.getStorages();
        this.formaR.reset();
        this.modalClose.nativeElement.click();
      });
  }

  AgregarDetalle() {
      this.detail._part._id = this.selectR.nativeElement.value;
      this.detail._part.desc = this.selectR.nativeElement.selectedOptions;
      console.log(this.detail);
  }

  crearCompra() {

  }

}
