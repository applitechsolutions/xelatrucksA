import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DatatablesService, GbillService } from '../../services/service.index';
import { DetailBill } from '../../models/gdetail.model';
import { PreDetailBill } from '../../models/gpredetail.model';
import swal from 'sweetalert';
import * as $ from 'jquery';
import * as moment from 'moment/moment';
import '../../../assets/vendor/select2/js/select2.js';

@Component({
  selector: 'app-gbill',
  templateUrl: './gbill.component.html',
  styles: []
})
export class GbillComponent implements OnInit, AfterViewInit {

  @ViewChild('date1') date1: ElementRef;
  @ViewChild('date2') date2: ElementRef;

  formGB: FormGroup;

  preDetail: PreDetailBill[] = [];
  details: DetailBill[] = [];

  constructor(
    public gbillService: GbillService,
    public dtService: DatatablesService
  ) { }

  ngOnInit() {
    const today = moment(new Date()).format('DD/MM/YYYY');
    this.dtService.init_datePicker(today);
    this.dtService.init_datePicker2();

    this.formGB = new FormGroup({
      customer: new FormControl(''),
      noBill: new FormControl(''),
      serie: new FormControl(''),
      date: new FormControl(null),
      oc: new FormControl(''),
      ac: new FormControl('')
    });
  }

  ngAfterViewInit() {
    $('.select2').select2();
  }

  generarPreDetalle() {

    const fecha1 = moment(this.date1.nativeElement.value, 'DD/MM/YYYY hh:mm').toDate();
    const fecha2 = moment(this.date2.nativeElement.value, 'DD/MM/YYYY hh:mm').toDate();

    if ( fecha1 > fecha2 ) {
      swal('Oops...', 'El rango de fechas no es válido', 'warning');
      return;
    }

    this.gbillService.cargarPreDetalle(fecha1, fecha2)
      .subscribe((res: any) => {
        this.preDetail = res.preDetail;
        console.log(this.preDetail);
        this.preDetail.forEach((item) => {
          switch (item.prod) {
            case 'Centro de Distribucion':
              this.details.push({
                _type: { name: item.prod, _id: item._id },
                mts: item.totalmts,
                trips: item.trips,
                cost: this.desalojo(item.totalmts)
              });
              break;
            case 'Cantera':
              this.details.push({
                _type: { name: item.prod, _id: item._id },
                mts: item.totalmts,
                trips: item.trips,
                cost: this.desalojo(item.totalmts)
              });
              break;
            case 'Desalojo':
              this.details.push({
                _type: { name: item.prod, _id: item._id },
                mts: item.totalmts,
                trips: item.trips,
                cost: this.desalojo(item.totalmts)
              });
              break;
            case 'Descapote':
              this.details.push({
                _type: { name: item.prod, _id: item._id },
                mts: item.totalmts,
                trips: item.trips,
                cost: this.desalojo(item.totalmts)
              });
              break;
            default:
              break;
          }
        });
      });
  }



  /* #region  FUNCIONES DE TARIFAS */

  desalojo(mts: number) {

    let tarifa: number = 0;
    let mtscont: number = mts;

    if (mts <= 300) {
      tarifa = 5000;
      return tarifa;
    } else if (mts > 300 && mts <= 2000) {
      tarifa = 5000;
      mtscont = mts - 300;
      tarifa += mtscont * 3.40;
      return tarifa;
    } else if (mts > 2000 && mts <= 8000) {
      tarifa = 10780;
      mtscont = mts - 2000;
      tarifa += mtscont * 2.90;
      return tarifa;
    } else if (mts > 8000 && mts <= 10000) {
      tarifa = 28180;
      mtscont = mts - 8000;
      tarifa += mtscont * 2.54;
      return tarifa;
    } else if (mts > 10000 && mts <= 12000) {
      tarifa = 33260;
      mtscont = mts - 10000;
      tarifa += mtscont * 2.44;
      return tarifa;
    } else if (mts > 12000) {
      tarifa = 38140;
      mtscont = mts - 12000;
      tarifa += mtscont * 2.35;
      return tarifa;
    }

  }

  cantera(mts: number) {
    let tarifa: number = 0;
    let mtscont: number = mts;

    if (mts <= 10000) {
      tarifa += mts * 5.13;
      return tarifa;
    } else if (mts > 10000 && mts <= 15000) {
      tarifa = 51300;
      mtscont = mts - 10000;
      tarifa += mtscont * 4.88;
      return tarifa;
    } else if (mts > 15000 && mts <= 20000) {
      tarifa = 75700;
      mtscont = mts - 15000;
      tarifa += mtscont * 4.63;
      return tarifa;
    } else if (mts > 20000 && mts <= 25000) {
      tarifa = 98850;
      mtscont = mts - 20000;
      tarifa += mtscont * 4.35;
      return tarifa;
    } else if (mts > 25000 && mts <= 30000) {
      tarifa = 120600;
      mtscont = mts - 25000;
      tarifa += mtscont * 4.11;
      return tarifa;
    } else if (mts > 30000) {
      tarifa = 141150;
      mtscont = mts - 30000;
      tarifa += mtscont * 3.90;
      return tarifa;
    }
  }

  descapote( mts: number ) {
    let tarifa: number = 0;
    let mtscont: number = mts;

    if (mts <= 300) {
      tarifa = 20000;
      return tarifa;
    } else if (mts > 300 && mts <= 5000) {
      tarifa = 20000;
      mtscont = mts - 300;
      tarifa += mtscont * 4.85;
      return tarifa;
    } else if (mts > 5000 && mts <= 10000) {
      tarifa = 42795;
      mtscont = mts - 5000;
      tarifa += mtscont * 4.25;
      return tarifa;
    } else if (mts > 10000 && mts <= 15000) {
      tarifa = 64045;
      mtscont = mts - 10000;
      tarifa += mtscont * 4.09;
      return tarifa;
    } else if (mts > 15000 && mts <= 20000) {
      tarifa = 84495;
      mtscont = mts - 15000;
      tarifa += mtscont * 3.84;
      return tarifa;
    } else if (mts > 20000 && mts <= 25000) {
      tarifa = 103695;
      mtscont = mts - 20000;
      tarifa += mtscont * 3.64;
      return tarifa;
    } else if (mts > 25000 && mts <= 30000) {
      tarifa = 121895;
      mtscont = mts - 25000;
      tarifa += mtscont * 3.44;
      return tarifa;
    } else if (mts > 30000) {
      tarifa = 139095;
      mtscont = mts - 30000;
      tarifa += mtscont * 3.24;
      return tarifa;
    }
  }

  /* #endregion */

}
