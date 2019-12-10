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
  myTable2 = '';
  dtButtons2 = '';
  clearSearch2 = '';
  tableSearch2 = '';
  filterBy2 = '';

  constructor(

  ) { }

  ngOnInit() {

  }

  MandarTableID(report: string) {
    this.myTable1 = '';
    this.myTable2 = '';

    switch (report) {
      case 'myTable1':
        this.myTable1 = 'myTable';
        this.dtButtons1 = 'dt-buttons';
        this.clearSearch1 = 'clear-search';
        this.tableSearch1 = 'table-search';
        this.filterBy1 = 'filterBy';
        break;
      case 'myTable2':
        this.myTable2 = 'myTable';
        this.dtButtons2 = 'dt-buttons';
        this.clearSearch2 = 'clear-search';
        this.tableSearch2 = 'table-search';
        this.filterBy2 = 'filterBy';
        break;
      default:
        break;
    }
  }

}
