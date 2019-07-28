import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/service.index';
import { DatatablesService } from '../../services/datatables/datatables.service';

declare function init_datatables();

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styles: []
})
export class EmployeesComponent implements OnInit {

  employees: Employee[] = [];

  constructor(
    public empService: EmployeeService,
    public dtService: DatatablesService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cargarEmpleados();
  }

  cargarEmpleados() {
    this.empService.cargarEmpleados()
      .subscribe( (res: any) => {
        this.employees = res.empleados;
        this.chRef.detectChanges();
        init_datatables();
      });
  }

}
