import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AutoProvider } from 'src/app/models/autoProvider.model';
import { BuySpare } from 'src/app/models/buySpare.model';
import { DatatablesService, UserService, AutoProviderService, BuySpareService } from 'src/app/services/service.index';

import * as $ from 'jquery';
import * as moment from 'moment/moment';

declare function init_datatables();
declare function destroy_datatables();
declare function init_reports();
declare var swal: any;

@Component({
  selector: 'app-purchases-by-providers',
  templateUrl: './purchases-by-providers.component.html',
  styles: []
})
export class PurchasesByProvidersComponent implements OnInit, AfterViewInit, OnChanges {

  @ViewChild('dateP1', { static: false }) dateP1: ElementRef;
  @ViewChild('dateP2', { static: false }) dateP2: ElementRef;
  @ViewChild('selectP', { static: false }) selectP: ElementRef;
  loading: boolean = false;

  @Input() idTable: string;
  @Input() dtButtons: string;
  @Input() clearSearch: string;
  @Input() tableSearch: string;
  @Input() filterBy: string;
  @Input() benito: string;
  @Input() invoice: string;
  @Input() downloadPdf: string;

  autoProviders: AutoProvider[] = [];
  buySpares: BuySpare[] = [];
  totalB = 0.00;
  totalDiscountB = 0.00;

  today: Date;
  date1Consulta = '';
  date2Consulta = '';
  nombreSelect = '';

  constructor(
    public dtService: DatatablesService,
    private chRef: ChangeDetectorRef,
    public userS: UserService,
    public autoProviderS: AutoProviderService,
    public buySpareS: BuySpareService
  ) { }

  ngOnInit() {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);

    this.autoProviderS.cargarProveedores()
      .subscribe((resp: any) => this.autoProviders = resp.proveedores);
  }

  ngAfterViewInit() {
    $('.select2').select2();
  }

  ngOnChanges(changes: SimpleChanges) {

    this.cambiarTableID(changes.idTable.currentValue);
    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values

  }

  cambiarTableID(idTable: string) {
    destroy_datatables();
  }

  createReportB() {
    this.today = new Date();
    this.chRef.detectChanges();
    init_reports();
  }

  searchB() {

    if (!this.selectP.nativeElement.value || !this.dateP1.nativeElement.value || !this.dateP2.nativeElement.value) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    this.loading = true;
    const _id = this.selectP.nativeElement.value;
    const fecha1 = moment(this.dateP1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.dateP2.nativeElement.value, 'DD/MM/YYYY').toDate();
    // BUSCAMOS LA FILA DENTRO DEL ARREGLO PARA TENER EL NOMBRE DEL TIPO SELECCIONADO
    const row = this.autoProviders.find(e => e._id === this.selectP.nativeElement.value);
    this.nombreSelect = row.name;

    this.buySpareS.cargarComprasProvider(_id, fecha1, fecha2).subscribe(resp => {
      destroy_datatables();
      this.buySpares = resp;
      // console.log(this.buySpares);
      this.totalsB();
      this.date1Consulta = this.dateP1.nativeElement.value;
      this.date2Consulta = this.dateP2.nativeElement.value;

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
