import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: []
})
export class ReportsComponent implements OnInit {

  myTable1 = 'myTable';
  dtButtons1 = 'dt-buttons';
  clearSearch1 = 'clear-search';
  tableSearch1 = 'table-search';
  filterBy1 = 'filterBy';
  benito1 = 'benito';
  invoice1 = 'invoice';
  myTable2 = '';
  dtButtons2 = '';
  clearSearch2 = '';
  tableSearch2 = '';
  filterBy2 = '';
  benito2 = 'benito';
  invoice2 = 'invoice';

  constructor(

  ) { }

  ngOnInit() {

  }

  MandarTableID(report: string) {
    this.myTable1 = '';
    this.dtButtons1 = '';
    this.clearSearch1 = '';
    this.tableSearch1 = '';
    this.filterBy1 = '';
    this.benito1 = '';
    this.invoice1 = '';
    this.myTable2 = '';
    this.dtButtons2 = '';
    this.clearSearch2 = '';
    this.tableSearch2 = '';
    this.filterBy2 = '';
    this.benito2 = '';
    this.invoice2 = '';

    switch (report) {
      case 'myTable1':
        this.myTable1 = 'myTable';
        this.dtButtons1 = 'dt-buttons';
        this.clearSearch1 = 'clear-search';
        this.tableSearch1 = 'table-search';
        this.filterBy1 = 'filterBy';
        this.benito1 = 'benito';
        this.invoice1 = 'invoice';
        break;
      case 'myTable2':
        this.myTable2 = 'myTable';
        this.dtButtons2 = 'dt-buttons';
        this.clearSearch2 = 'clear-search';
        this.tableSearch2 = 'table-search';
        this.filterBy2 = 'filterBy';
        this.benito2 = 'benito';
        this.invoice2 = 'invoice';
        break;
      default:
        break;
    }
  }

}
