import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { VehicleService, DatatablesService, UserService } from 'src/app/services/service.index';
import { Gas } from '../../models/gas.model';
import { Vehicle } from '../../models/vehicle.model';
import { User } from '../../models/user.model';
import * as $ from 'jquery';
import * as moment from 'moment/moment';
import '../../../assets/vendor/select2/js/select2.js';

declare function init_datatables();
declare function destroy_datatables();
declare function init_reports();
declare var swal: any;

@Component({
  selector: 'app-gasolines',
  templateUrl: './gasolines.component.html',
  styles: []
})
export class GasolinesComponent implements OnInit, AfterViewInit {

  select2: any;
  loading: boolean = false;
  @ViewChild('date1', { static: false }) date1: ElementRef;
  @ViewChild('date2', { static: false }) date2: ElementRef;
  @ViewChild('selectV', { static: false }) selectV: ElementRef;
  @ViewChild('dateG', { static: false }) dateG: ElementRef;
  @ViewChild('closeMG', { static: false }) closeMG: ElementRef;

  gasolines: Gas[] = [];
  vehicles: Vehicle[] = [];

  formGas: FormGroup;
  idGas: string = '';
  idVehicle: string = '';

  totalGas: number = 0.00;
  totalGal: number = 0.00;
  fecha1Consulta: string = '';
  fecha2Consulta: string = '';
  usuario: User;
  today: Date;

  init: boolean = true;

  constructor(
    public vehicleS: VehicleService,
    public dtService: DatatablesService,
    private chRef: ChangeDetectorRef,
    private userS: UserService
  ) { }

  ngOnInit() {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);

    this.vehicleS.cargarVehiculos()
      .subscribe( (resp: any) => this.vehicles = resp.vehiculos);

    this.formGas = new FormGroup({
      gallons: new FormControl(null, Validators.required),
      total: new FormControl(null, Validators.required),
      code: new FormControl(null)
    });
    this.usuario = this.userS.usuario;
  }

  ngAfterViewInit() {
    $('.select2').select2();
  }

  createReport() {
    this.today = new Date();
    this.chRef.detectChanges();
    init_reports();
  }

  searchG() {
    this.loading = true;
    const fecha1 = moment(this.date1.nativeElement.value, 'DD/MM/YYYY').toDate();
    const fecha2 = moment(this.date2.nativeElement.value, 'DD/MM/YYYY').toDate();

    this.vehicleS.cargarGasolinesAll(fecha1, fecha2).subscribe(resp => {
      destroy_datatables();
      this.gasolines = resp;
      // console.log(this.gasolines);
      this.calcularTotalesG();
      this.fecha1Consulta = this.date1.nativeElement.value;
      this.fecha2Consulta = this.date2.nativeElement.value;
      this.chRef.detectChanges();
      init_datatables();
      this.loading = false;
    });
  }

  addGas() {

    const idVehicle = this.selectV.nativeElement.value;
    const fecha = moment(this.dateG.nativeElement.value, 'DD/MM/YYYY').toDate();

    if (this.idGas !== '') {
      // ('EDITANDO...');
      const gasoline = new Gas(
        fecha.toString(),
        this.formGas.value.gallons,
        this.formGas.value.total,
        this.formGas.value.code,
        false,
        this.idGas
      );
      // SI EL ID DEL VEHICULO ES DIFERENTE ENTONCES HAY BORRAR Y CREAR UNO NUEVO sino solo se actualiza la info
      if (this.idVehicle === idVehicle) {
        this.vehicleS.crearGasoline(gasoline, idVehicle)
        .subscribe(resp => {
          this.searchG();
         });
      } else {
        const Newgasoline = new Gas(
          fecha.toString(),
          this.formGas.value.gallons,
          this.formGas.value.total,
          this.formGas.value.code,
          false
        );
        this.vehicleS.borrarGasoline(gasoline, this.idVehicle)
           .subscribe(resp => {});
        this.vehicleS.crearGasoline(Newgasoline, idVehicle)
        .subscribe(resp => {
          this.searchG();
        });
      }
      this.idGas = '';
    } else {
      // console.log('GUARDANDO...');

      const gasoline = new Gas(
        fecha.toString(),
        this.formGas.value.gallons,
        this.formGas.value.total,
        this.formGas.value.code,
        false
      );

      this.vehicleS.crearGasoline(gasoline, idVehicle)
        .subscribe(resp => {
          this.searchG();
         });
    }

    this.closeMG.nativeElement.click();
    this.formGas.reset();
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dateG.nativeElement.value = today;
  }

  editarGas(id: string, idVehicle: string) {

    const status: Gas = this.gasolines.find(s => s._id === id);

    if (status) {
      const fecha = this.dtService.fromJsonDate(status.date);
      this.selectV.nativeElement.value = idVehicle;
      $('.select2').val(idVehicle).trigger('change');
      this.idVehicle = idVehicle;
      this.dateG.nativeElement.value = fecha;
      this.formGas.get('code').setValue(status.code);
      this.formGas.get('gallons').setValue(status.gallons);
      this.formGas.get('total').setValue(status.total);
      this.idGas = status._id;
    }
  }

  deleteGas(id: string, idVehicle: string) {
    // console.log('BORRANDO...');
    // BUSCAMOS EL INDEX en el que se encuentra el item a editar dentro del arreglo de basics
    const index = this.gasolines.findIndex(item => item._id === id);
    const status: Gas = this.gasolines.find(s => s._id === id);

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar información del consumo de gasolina de un vehiculo',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          destroy_datatables();
          // ELIMINAMOS EL BASIC en base al index encontrado
          this.gasolines.splice(index, 1);

          const gasoline = new Gas(
            status.date,
            status.gallons,
            status.total,
            status.code,
            false,
            id
          );

          this.vehicleS.borrarGasoline(gasoline, idVehicle)
            .subscribe(resp => { });

          this.calcularTotalesG();
          this.chRef.detectChanges();
          init_datatables();
        }
      });
  }

  calcularTotalesG() {
    // SUMAS PARA LOS TOTAL DE GASOLINA Y GALONES CONSUMIDOS -------------
    this.totalGas = this.gasolines.reduce((sum, item) => sum + item.total, 0);
    this.totalGal = this.gasolines.reduce((sum, item) => sum + item.gallons, 0);
    // ------------
  }
}
