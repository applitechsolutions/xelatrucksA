import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styles: []
})
export class DataTableComponent implements OnInit {

  @Input() headers: any[] = [];
  @Input() bodys: any[] = [];
  @Input() rows: any[] = [];
  @Input() cols: any[] = [];
  @Input() footers: any[] = [];

  constructor() { }

  ngOnInit() {
  }

}
