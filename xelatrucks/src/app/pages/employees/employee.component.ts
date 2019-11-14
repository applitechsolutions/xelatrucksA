import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatatablesService, EmployeeService } from '../../services/service.index';
import { Employee } from '../../models/employee.model';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert';
import * as $ from 'jquery';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styles: []
})
export class EmployeeComponent implements OnInit, AfterViewInit {

  @ViewChild('selectJ', { static: false }) selectJ: ElementRef;

  formE: FormGroup;
  employee: Employee = new Employee();
  jobs: any[] = [];

  constructor(
    public router: Router,
    public empService: EmployeeService,
    public dtService: DatatablesService,
    public activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe( params => {

      const id = params.id;
      if (id !== 'new') {
        this.cargarEmpleado( id );
      }
    });
  }

  ngOnInit() {

    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);

    this.jobs = [
      {
        job: 'ADMINISTRADOR',
        txt: 'Admistrador'
      },
      {
        job: 'PLANILLA',
        txt: 'Planilla'
      },
      {
        job: 'CD',
        txt: 'Centro de Distribución'
      }
    ];

    this.formE = new FormGroup({
      job: new FormControl(''),
      noEntry: new FormControl(null),
      account: new FormControl(null),
      name: new FormControl(null),
      date: new FormControl(null),
      pay: new FormControl(null),
      dpi: new FormControl(null),
      address: new FormControl(null),
      mobile: new FormControl(null),
      igss: new FormControl(null),
    });
  }

  ngAfterViewInit() {
    $('.select2').select2();
    $('.select2').on('change', (e) => this.formE.value.job = $(e.target).val());
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);
  }

  cargarEmpleado( id: string ) {
    this.empService.cargarEmpleado(id)
      .subscribe( (res: any) => {
        this.employee = res.empleado;
        const fecha = this.dtService.fromJsonDate(this.employee.datestart);
        $('.select2').val(this.employee.job).trigger('change');
        this.formE.get('noEntry').setValue(this.employee.entry);
        this.formE.get('account').setValue(this.employee.account);
        this.formE.get('name').setValue(this.employee.name);
        this.formE.get('date').setValue(fecha);
        this.dtService.init_datePicker(fecha);
        this.formE.get('pay').setValue(this.employee.pay);
        this.formE.get('dpi').setValue(this.employee.dpi);
        this.formE.get('address').setValue(this.employee.address);
        this.formE.get('mobile').setValue(this.employee.mobile);
        this.formE.get('igss').setValue(this.employee.igss);
      });
  }

  crearEmpleado() {
    // console.log(this.formE.value);
    // console.log(this.formE.valid);
    this.formE.value.job = this.selectJ.nativeElement.value;

    if (this.formE.invalid) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }


    let employee;

    if (this.employee._id) {
      employee = new Employee(
        this.formE.value.job,
        this.formE.value.noEntry,
        this.formE.value.account,
        this.formE.value.name,
        moment(this.formE.value.date, 'DD/MM/YYYY').toDate(),
        this.formE.value.pay,
        this.formE.value.dpi,
        this.formE.value.address,
        this.formE.value.mobile,
        this.formE.value.igss,
        this.employee._id
      );
    } else {
      employee = new Employee(
        this.formE.value.job,
        this.formE.value.noEntry,
        this.formE.value.account,
        this.formE.value.name,
        moment(this.formE.value.date, 'DD/MM/YYYY').toDate(),
        this.formE.value.pay,
        this.formE.value.dpi,
        this.formE.value.address,
        this.formE.value.mobile,
        this.formE.value.igss
      );
    }

    // console.log(employee);

    this.empService.crearEmpleado(employee)
      .subscribe( () => this.router.navigate(['/employees']));

  }

}
