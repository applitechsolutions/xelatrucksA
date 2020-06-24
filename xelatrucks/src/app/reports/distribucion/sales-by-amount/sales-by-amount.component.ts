import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { SaleService, DatatablesService } from 'src/app/services/service.index';

import * as $ from 'jquery';
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

  today: Date;


  constructor(
    public saleService: SaleService,
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

  searchB() { }

}
