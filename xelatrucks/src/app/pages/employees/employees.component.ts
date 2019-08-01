import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/service.index';
import { DatatablesService } from '../../services/datatables/datatables.service';

declare function init_datatables();
declare var swal: any;

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
        this.dtService.init_tables();
      });
  }

  borrarEmpleado( empleado: Employee ) {

    console.log(empleado);

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar a ' + empleado.name,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {
      if (borrar) {
        empleado.state = true;

        this.empService.borrarEmpleado( empleado )
          .subscribe( borrado => {
            this.dtService.destroy_table();
            this.cargarEmpleados();
          });
      }

    });
  }

}
