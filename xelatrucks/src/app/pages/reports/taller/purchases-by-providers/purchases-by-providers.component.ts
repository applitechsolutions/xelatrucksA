import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { DatatablesService, UserService, AutoProviderService, BuySpareService } from 'src/app/services/service.index';
import { AutoProvider } from 'src/app/models/autoProvider.model';
import { BuySpare } from 'src/app/models/buySpare.model';

import * as $ from 'jquery';
import * as moment from 'moment/moment';

declare function init_datatables();
declare function destroy_datatables();
declare function init_reports();
declare var swal: any;

@Component({
  selector: 'app-purchases-by-providers',
  templateUrl: './purchases-by-providers.component.html',
  styles: [
  ]
})
export class PurchasesByProvidersComponent implements OnInit, AfterViewInit {

  @ViewChild('date1') date1: ElementRef;
  @ViewChild('date2') date2: ElementRef;
  @ViewChild('selectP') selectP: ElementRef;
  loading: boolean = false;

  autoProviders: AutoProvider[] = [];
  buySpares: BuySpare[] = [];
  totalB = 0.00;
  totalDiscountB = 0.00;

  today: Date;
  titulo = '';
  subTitulo = '';

  constructor(
    public dtService: DatatablesService,
    private chRef: ChangeDetectorRef,
    public userS: UserService,
    public autoProviderS: AutoProviderService,
    public buySpareS: BuySpareService
  ) { }

  ngOnInit(): void {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);

    this.autoProviderS.cargarProveedores()
      .subscribe((resp: any) => this.autoProviders = resp.proveedores);
  }

  ngAfterViewInit() {
    $('.select2').select2();
  }

  createReport() {
    this.today = new Date();
    this.chRef.detectChanges();
    init_reports();
  }

  search() {

    if (!this.selectP.nativeElement.value || !this.date1.nativeElement.value || !this.date2.nativeElement.value) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    this.loading = true;
    const _id = this.selectP.nativeElement.value;
    const fecha1 = moment(this.date1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.date2.nativeElement.value, 'DD/MM/YYYY').toDate();
    // BUSCAMOS LA FILA DENTRO DEL ARREGLO PARA TENER EL NOMBRE DEL TIPO SELECCIONADO
    const row = this.autoProviders.find(e => e._id === this.selectP.nativeElement.value);
    this.titulo = 'Compras realizadas a ' + row.name;
    this.subTitulo = this.date1.nativeElement.value + ' - ' + this.date2.nativeElement.value;

    this.buySpareS.cargarComprasProvider(_id, fecha1, fecha2).subscribe(resp => {
      destroy_datatables();
      this.buySpares = resp;
      // console.log(this.buySpares);
      this.totalsB();

      this.chRef.detectChanges();
      init_datatables();
      this.loading = false;
    });
  }

  totalsB() {
    // SUMAS PARA LOS TOTAL DE GASOLINA Y GALONES CONSUMIDOS -------------
    this.totalB = this.buySpares.reduce((sum, item) => sum + item.total, 0);
    this.totalDiscountB = this.buySpares.reduce((sum, item) => sum + item.discount, 0);
  }

}
