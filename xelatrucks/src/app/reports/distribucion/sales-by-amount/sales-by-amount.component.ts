import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SaleService, DatatablesService, UserService } from 'src/app/services/service.index';

import * as moment from 'moment/moment';

declare function init_datatables();
declare function destroy_datatables();
declare function init_reports();
declare var swal: any;
@Component({
  selector: 'app-sales-by-amount',
  templateUrl: './sales-by-amount.component.html',
  styles: [
  ]
})
export class SalesByAmountComponent implements OnInit {

  @ViewChild('dateP1') dateP1: ElementRef;
  @ViewChild('dateP2') dateP2: ElementRef;
  @ViewChild('startAmount') startAmount: ElementRef;
  @ViewChild('endAmount') endAmount: ElementRef;

  @Input() idTable: string;
  @Input() dtButtons: string;
  @Input() clearSearch: string;
  @Input() tableSearch: string;
  @Input() filterBy: string;
  @Input() benito: string;
  @Input() invoice: string;
  @Input() downloadPdf: string;

  sales: any[] = [];
  totalS: number = 0.00;
  totalF: number = 0.00;

  today: Date;
  date1Consulta = '';
  date2Consulta = '';
  amount1Consulta = 0;
  amount2Consulta = 0;
  loading: boolean = false;

  constructor(
    public saleService: SaleService,
    public userS: UserService,
    public dtService: DatatablesService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

    this.cambiarTableID(changes.idTable.currentValue);
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
    if (!this.dateP1.nativeElement.value || !this.dateP2.nativeElement.value || !this.startAmount.nativeElement.value || !this.endAmount.nativeElement.value) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }
    this.loading = true;

    const fecha1 = moment(this.dateP1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.dateP2.nativeElement.value, 'DD/MM/YYYY').toDate();
    const cant1 = this.startAmount.nativeElement.value;
    const cant2 = this.endAmount.nativeElement.value;

    this.saleService.salesByAmount(fecha1, fecha2, cant1, cant2)
      .subscribe((res: any) => {
        console.log(res.ventas);
        destroy_datatables();
        this.sales = res.ventas;
        this.totalB();
        this.date1Consulta = this.dateP1.nativeElement.value;
        this.date2Consulta = this.dateP2.nativeElement.value;
        this.amount1Consulta = this.startAmount.nativeElement.value;
        this.amount2Consulta = this.endAmount.nativeElement.value;
        this.chRef.detectChanges()
        init_datatables();
        this.loading = false;
      }, (err: any) => {
        console.log(err.message);
        this.loading = false;
        swal('Uy!', 'Algo salió mal, intenta más tarde', 'error');
      });
  }

  totalB() {
    this.totalS = this.sales.reduce((sum, item) => sum + item.total, 0);
    this.totalF = this.sales.reduce((sum, item) => sum + item.flete, 0);
  }

}
