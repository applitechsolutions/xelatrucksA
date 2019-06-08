import { Component, OnInit } from '@angular/core';
import { DatatablesService } from '../../services/service.index';

// declare function DataTable(): any;

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styles: []
})
export class VehiclesComponent implements OnInit {

  constructor(public dtService: DatatablesService) { }

  ngOnInit() {
    this.dtService.init_tables();
  }

}
