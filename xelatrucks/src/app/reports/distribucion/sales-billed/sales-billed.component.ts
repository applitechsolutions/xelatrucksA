import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Input, SimpleChanges } from '@angular/core';
import { SaleService, DatatablesService, UserService } from 'src/app/services/service.index';

import * as moment from 'moment/moment';

declare function init_datatables();
declare function destroy_datatables();
declare function init_reports();
declare var swal: any;
@Component({
  selector: 'app-sales-billed',
  templateUrl: './sales-billed.component.html',
  styles: [
  ]
})
export class SalesBilledComponent implements OnInit {

  @ViewChild('dateP1') dateP1: ElementRef;
  @ViewChild('dateP2') dateP2: ElementRef;
  loading: boolean = false;

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

}
