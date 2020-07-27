import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CashServiceService, DatatablesService, UserService } from 'src/app/services/service.index';
import { CashCD } from '../../models/cashCD.model';
import { CashTypeCD } from '../../models/cashTypeCD.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';

declare function init_datatables();
declare function destroy_datatables();
declare function init_datatables2();
declare function destroy_datatables2();
import * as moment from 'moment/moment';
declare var swal: any;

@Component({
  selector: 'app-cash-cd',
  templateUrl: './cash-cd.component.html',
  styles: [
  ]
})
export class CashCDComponent implements OnInit {

  @ViewChild('date') date: ElementRef;
  @ViewChild('date1') date1: ElementRef;
  @ViewChild('date2') date2: ElementRef;
  @ViewChild('closeM') closeM: ElementRef;

  loadingM = false;
  loading = false;

  cashsToday: CashCD[] = [];
  cashs: CashCD[] = [];
  cashTypes: CashTypeCD[] = [];
  cashBalance: any = {};
  cashType: CashTypeCD = {
    name: '',
    type: 'INGRESO'
  };
  formaCash: FormGroup;
  ingresosT = 0;
  egresosT = 0;
  today;

  constructor(
    public cashS: CashServiceService,
    public datePickerS: DatatablesService,
    public userS: UserService,
    public chRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.today = moment(new Date()).format('DD/MM/YYYY');
    this.datePickerS.init_datePicker(this.today);

    this.formaCash = new FormGroup({
      cashType: new FormControl('', Validators.required),
      amount: new FormControl('', Validators.required),
      details: new FormControl('')
    }, {});

    this.cargarBalance();
    this.cargarTipos();
    this.cargarMovimientosToday();
  }

  cargarBalance() {
    this.cashS.cargarSaldo().subscribe(cash => {
      this.cashBalance = cash;
      // console.log(this.saleCorrelative);
    });
  }

  cargarMovimientosToday() {
    const fecha1 = moment(this.today, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.today, 'DD/MM/YYYY').toDate();
    this.ingresosT = 0;
    this.egresosT = 0;

    this.cashS.cargarMovimientos(fecha1, fecha2)
      .subscribe(resp => {
        // destroy_datatables();
        this.cashsToday = resp;

        this.cashsToday.forEach((index) => {
          if (!index._cashTypeCD || index._cashTypeCD.type === 'INGRESO') {
            this.ingresosT = +this.ingresosT + +index.amount;
          } else if (index._cashTypeCD.type === 'EGRESO') {
            this.egresosT = +this.egresosT + +index.amount;
          }
        });
      });
  }

  buscarMovimientos() {
    const fecha1 = moment(this.date1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.date2.nativeElement.value, 'DD/MM/YYYY').toDate();

    this.cashS.cargarMovimientos(fecha1, fecha2)
      .subscribe(resp => {
        destroy_datatables2();
        this.cashs = resp;

        this.chRef.detectChanges();
        init_datatables2();
      });
  }

  anularMovimiento(cash: CashCD) {
    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de ANULAR el movimiento por  Q' + cash.amount,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {

        if (borrar) {
          this.loading = true;

          this.cashS.borrarMovimiento(cash._id)
            .subscribe(resp => {
              this.cargarMovimientosToday();
              this.loading = false;
            });
        }
      });
  }

  crearMovimiento() {

    if (this.formaCash.invalid) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }
    this.loadingM = true;
    const fecha = moment(this.date.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha1 = moment(this.today, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.today, 'DD/MM/YYYY').toDate();


    let balance = 0;

    if (this.cashBalance) {
      // Buscamos el tipo de movimiento Ingreso \ Egreso
      const row = this.cashTypes.find(e => e._id === this.formaCash.value.cashType);
      if (row.type === 'INGRESO') {
        balance = +this.cashBalance.balance + +this.formaCash.value.amount;
      } else {
        balance = +this.cashBalance.balance - +this.formaCash.value.amount;
      }
    } else {
      balance = this.formaCash.value.amount;
    }

    const cash = new CashCD(
      this.formaCash.value.cashType,
      this.userS.usuario,
      fecha.toString(),
      this.formaCash.value.amount,
      balance,
      this.formaCash.value.details
    );

    this.cashS.crearMovimiento(cash)
      .subscribe(resp => {
        console.log(resp);
        swal({
          title: '¡Creado!',
          text: 'Movimiento creado con éxito',
          icon: 'success',
          button: false,
          timer: 1000
        });
        this.formaCash.reset({
          cashType: '',
          amount: '',
          details: ''
        });
        this.cargarBalance();
        this.cargarMovimientosToday();
        this.loadingM = false;
        this.closeM.nativeElement.click();
      });
  }

  /* #region  TIPOS DE MOVIMIENTOS */
  cargarTipos() {
    this.cashS.cargarTiposMovimiento()
      .subscribe((resp: any) => {
        this.cashTypes = resp.movimientos;
        this.chRef.detectChanges();
        init_datatables();
      });
  }

  cargarTipo(id: string) {
    this.loading = true;
    this.cashS.cargarTipoMovimiento(id)
      .subscribe(resp => {
        this.cashType = resp;
        this.loading = false;
      });
  }

  borrarTipo(cashType: CashTypeCD) {
    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar a ' + cashType.name,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          this.cashS.borrarTipoMovimiento(cashType._id)
            .subscribe((borrado: any) => {
              destroy_datatables();
              this.cargarTipos();
            });
        }
      });
  }

  crearTipo() {
    this.loading = true;

    this.cashS.crearTipoMovimiento(this.cashType)
      .subscribe(resp => {
        destroy_datatables();
        this.cargarTipos();
        this.closeM.nativeElement.click();
        this.loading = false;
      });

    this.cashType = {
      name: '',
      type: 'INGRESO'
    };
  }
  /* #endregion */

}
