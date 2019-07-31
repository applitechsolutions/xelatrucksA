import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { Vehicle } from '../../models/vehicle.model';
import { EmployeeService, VehicleService } from '../../services/service.index';
import * as $ from 'jquery';
import '../../../assets/vendor/select2/js/select2.js';


@Component({
  selector: 'app-gtrips',
  templateUrl: './gtrips.component.html',
  styles: []
})
export class GtripsComponent implements OnInit, AfterViewInit {

  employees: Employee[] = [];
  vehicles: Vehicle[] = [];

  constructor(
    public empService: EmployeeService,
    public vehicleService: VehicleService
  ) { }

  ngOnInit() {
    this.cargarEmpleados();
    this.cargarVehiculos();
  }

  ngAfterViewInit() {
    $('.select2').select2();
  }

  cargarEmpleados() {
    this.empService.cargarEmpleados()
      .subscribe( (res: any) => this.employees = res.empleados );
  }

  cargarVehiculos() {
    this.vehicleService.cargarVehiculos()
      .subscribe( (res: any) => this.vehicles = res.vehiculos );
  }

}
