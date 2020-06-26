import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cd-reports',
  templateUrl: './cd-reports.component.html',
  styles: [
  ]
})
export class CdReportsComponent implements OnInit {

  myTable1 = 'myTable';
  dtButtons1 = 'dt-buttons';
  clearSearch1 = 'clear-search';
  tableSearch1 = 'table-search';
  filterBy1 = 'filterBy';
  benito1 = 'benito';
  invoice1 = 'invoice';
  downloadPdf1 = 'download-pdf';
  // Reporte 2
  myTable2 = '';
  dtButtons2 = '';
  clearSearch2 = '';
  tableSearch2 = '';
  filterBy2 = '';
  benito2 = 'benito';
  invoice2 = 'invoice';
  downloadPdf2 = 'download-pdf';
  // Reporte 3
  myTable3 = '';
  dtButtons3 = '';
  clearSearch3 = '';
  tableSearch3 = '';
  filterBy3 = '';
  benito3 = 'benito';
  invoice3 = 'invoice';
  downloadPdf3 = 'download-pdf';
  // Reporte 4
  myTable4 = '';
  dtButtons4 = '';
  clearSearch4 = '';
  tableSearch4 = '';
  filterBy4 = '';
  benito4 = 'benito';
  invoice4 = 'invoice';
  downloadPdf4 = 'download-pdf';

  constructor() { }

  ngOnInit(): void {
  }

  MandarTableID(report: string) {
    this.myTable1 = '';
    this.dtButtons1 = '';
    this.clearSearch1 = '';
    this.tableSearch1 = '';
    this.filterBy1 = '';
    this.benito1 = '';
    this.invoice1 = '';
    this.downloadPdf1 = '';
    // Reporte 2
    this.myTable2 = '';
    this.dtButtons2 = '';
    this.clearSearch2 = '';
    this.tableSearch2 = '';
    this.filterBy2 = '';
    this.benito2 = '';
    this.invoice2 = '';
    this.downloadPdf2 = '';
    // Reporte 3
    this.myTable3 = '';
    this.dtButtons3 = '';
    this.clearSearch3 = '';
    this.tableSearch3 = '';
    this.filterBy3 = '';
    this.benito3 = '';
    this.invoice3 = '';
    this.downloadPdf3 = '';
    // Reporte 4
    this.myTable4 = '';
    this.dtButtons4 = '';
    this.clearSearch4 = '';
    this.tableSearch4 = '';
    this.filterBy4 = '';
    this.benito4 = '';
    this.invoice4 = '';
    this.downloadPdf4 = '';


    switch (report) {
      case 'myTable1':
        this.myTable1 = 'myTable';
        this.dtButtons1 = 'dt-buttons';
        this.clearSearch1 = 'clear-search';
        this.tableSearch1 = 'table-search';
        this.filterBy1 = 'filterBy';
        this.benito1 = 'benito';
        this.invoice1 = 'invoice';
        this.downloadPdf1 = 'download-pdf';
        break;
      case 'myTable2':
        this.myTable2 = 'myTable';
        this.dtButtons2 = 'dt-buttons';
        this.clearSearch2 = 'clear-search';
        this.tableSearch2 = 'table-search';
        this.filterBy2 = 'filterBy';
        this.benito2 = 'benito';
        this.invoice2 = 'invoice';
        this.downloadPdf2 = 'download-pdf';
        break;
      case 'myTable3':
        this.myTable3 = 'myTable';
        this.dtButtons3 = 'dt-buttons';
        this.clearSearch3 = 'clear-search';
        this.tableSearch3 = 'table-search';
        this.filterBy3 = 'filterBy';
        this.benito3 = 'benito';
        this.invoice3 = 'invoice';
        this.downloadPdf3 = 'download-pdf';
        break;
      case 'myTable4':
        this.myTable4 = 'myTable';
        this.dtButtons4 = 'dt-buttons';
        this.clearSearch4 = 'clear-search';
        this.tableSearch4 = 'table-search';
        this.filterBy4 = 'filterBy';
        this.benito4 = 'benito';
        this.invoice4 = 'invoice';
        this.downloadPdf4 = 'download-pdf';
      default:
        break;
    }

  }
}