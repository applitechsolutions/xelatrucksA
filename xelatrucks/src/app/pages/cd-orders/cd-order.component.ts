import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { OrderService, MaterialService, PullService } from 'src/app/services/service.index';
import { Pull } from 'src/app/models/pull.model';
import { StorageMaterial } from 'src/app/models/storageMaterial.model';
import { Order } from 'src/app/models/order.model';

import * as $ from 'jquery';
import * as moment from 'moment/moment';
declare var swal: any;

@Component({
  selector: 'app-cd-order',
  templateUrl: './cd-order.component.html',
  styles: [
  ]
})
export class CdOrderComponent implements OnInit, AfterViewInit {

  @ViewChild('dateOrder') dateOrder: ElementRef;
  @ViewChild('closeO') closeO: ElementRef;
  @ViewChild('selectM') selectM: ElementRef;

  @Output() pasarOrden = new EventEmitter();

  loadingM = false;

  pullsDetail: Pull[] = [];
  materials: StorageMaterial[] = [];

  order: Order = {
    _destination: null,
    date: '',
    order: ''
  };
  pullOrder: Pull = { _order: null, _material: null, mts: 0, totalMts: 0, kg: 0, totalKg: 0 };
  totalMts = 0;
  totalKgs = 0;

  constructor(
    public orderS: OrderService,
    public materialS: MaterialService,
    public pullS: PullService
  ) { }

  ngOnInit(): void {
    this.cargarMateriales();
  }

  ngAfterViewInit() {
    $('.select2').select2();
  }

  cargarMateriales() {
    this.materialS.cargarMateriales()
      .subscribe((res: any) => {
        res.materiales
          .map((resp: any) => {
            this.materials = resp.storage;
          });
        // console.log(this.materials);
      });
  }

  crearOrden() {
    const fecha = moment(this.dateOrder.nativeElement.value, 'DD/MM/YYYY').toDate();

    if (this.order.order === '' || this.dateOrder.nativeElement.value === '') {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    if (this.pullsDetail.length === 0) {
      swal('Oops...', 'Debe agregar materiales al detalle', 'warning');
      return;
    }

    this.orderS.cargarOrden(fecha, this.order.order)
      .subscribe((resp: any) => {

        if (resp.length > 0) {
          swal('Oops...', 'La orden ya existe en la fecha seleccionada', 'warning');
          return;
        } else {
          this.loadingM = true;

          this.order._destination = { // EL ID CORRESPONDE AL CENTRO DE DISTRIBUCION
            _id: '5e31e0a9c71f490a70eb2884',
            name: '',
            type: '',
            km: 0,
            tariff: 0
          };
          this.order.date = fecha.toString();

          this.orderS.crearOrden(this.order)
            .subscribe(resp2 => {
              const orderDB: Order = resp2.orden;
              let itemsProcessed = 0;

              this.pullsDetail.forEach(element => {

                const pull: Pull = {
                  _order: orderDB,
                  _material: element._material,
                  mts: 0,
                  totalMts: element.totalMts,
                  kg: 0,
                  totalKg: element.totalKg
                };

                this.pullS.crearPull(pull)
                  .subscribe(resp3 => {
                    itemsProcessed++;

                    // console.log(itemsProcessed);
                    // console.log(this.pullsDetail.length);
                    if (itemsProcessed === this.pullsDetail.length) {
                      this.loadingM = false;
                      this.closeO.nativeElement.click();
                      swal('Orden creada', 'Pull de materiales creado correctamente', 'success');
                      this.pasarOrden.emit('OK');
                      this.order = {
                        _destination: null,
                        date: '',
                        order: ''
                      };
                      this.pullsDetail = [];
                      this.totalMts = 0;
                      this.totalKgs = 0;
                    }
                  });
              });
            });
        }
      });

  }

  agregarDetalle() {
    if (this.selectM.nativeElement.value === '' || this.pullOrder.totalMts <= 0 || this.pullOrder.totalKg <= 0) {
      swal('Oops...', 'Por favor ingrese los campos obligatorios y válidos', 'warning');
      return;
    }

    if (this.pullsDetail.find(e => e._material._id === this.selectM.nativeElement.value)) {
      // Pull existente
      const pull = this.pullsDetail.find(e => e._material._id === this.selectM.nativeElement.value);
      // Index del pull existente
      const index = this.pullsDetail.findIndex(e => e._material._id === this.selectM.nativeElement.value);
      // Recalcular el total de mts y kg
      this.pullOrder.totalMts = pull.totalMts + this.pullOrder.totalMts;
      this.pullOrder.totalKg = pull.totalKg + this.pullOrder.totalKg;
      this.pullOrder._material = pull._material;
      console.log(this.pullOrder);
      // Remplazamos el pull por el nuevo recalculado
      this.pullsDetail.splice(index, 1, this.pullOrder);
    } else {
      const material = this.materials.find(e => e._material._id === this.selectM.nativeElement.value);
      this.pullOrder._material = material._material;
      this.pullsDetail.push({
        _order: null,
        _material: this.pullOrder._material,
        mts: 0,
        totalMts: this.pullOrder.totalMts,
        kg: 0,
        totalKg: this.pullOrder.totalKg
      });
    }

    this.calcularTotales();
    swal({
      title: '¡Agregado!',
      text: 'Material agregado al detalle',
      icon: 'success',
      button: false,
      timer: 1000
    });
    this.pullOrder = { _order: null, _material: null, mts: 0, totalMts: 0, kg: 0, totalKg: 0 };
  }

  quitarDetalle(id: string) {

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar un registro del detalle',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          // BUSCAMOS EL INDEX en el que se encuentra el item a eliminar
          const index = this.pullsDetail.findIndex(item => item._material._id === id);

          // ELIMINAMOS EL DETALLE en base al index encontrado
          this.pullsDetail.splice(index, 1);
          this.calcularTotales();
        }
      });
  }

  calcularTotales() {
    // SUMAS PARA LOS TOTAL DE MTRS Y KG CONSUMIDOS -------------
    this.totalMts = this.pullsDetail.reduce((sum, item) => sum + item.totalMts, 0);
    this.totalKgs = this.pullsDetail.reduce((sum, item) => sum + item.totalKg, 0);
    // ------------
  }

}
