import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DestinationService } from 'src/app/services/service.index';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Tariff } from '../../models/tariff.model';
import { Destination } from '../../models/destination.model';

declare var swal: any;

@Component({
  selector: 'app-destination',
  templateUrl: './destination.component.html',
  styles: []
})
export class DestinationComponent implements OnInit {

  @ViewChild('closeM', { static: false }) closeM: ElementRef;

  formaDestination: FormGroup;
  formaTariff: FormGroup;

  tariffs: Tariff[] = [];

  constructor(
    public destinationS: DestinationService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe(params => {

      const id = params.id;

      if (id !== 'new') {
        this.cargarType(id);
      }

    });
  }

  ngOnInit() {

    this.formaDestination = new FormGroup({
      _id: new FormControl(''),
      type: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      km: new FormControl('', Validators.required)
    });

    this.formaTariff = new FormGroup({
      start: new FormControl(0, Validators.required),
      end: new FormControl(0, Validators.required),
      cost: new FormControl(0, Validators.required)
    });
  }

  cargarType(id: string) {

    this.destinationS.cargarDestino(id)
      .subscribe(resp => {
        this.formaDestination.get('_id').setValue(resp._id);
        this.formaDestination.get('type').setValue(resp.type);
        this.formaDestination.get('name').setValue(resp.name);
        this.formaDestination.get('km').setValue(resp.km);
      });
  }

  agregarTarifa() {

    if (this.formaTariff.value.start >= this.formaTariff.value.end) {
      swal('Oops...', 'El rango inicial no puede ser mayor o igual al rango final', 'warning');
      return;
    }

    if (this.tariffs.length > 0) {

      const lastTariff = this.tariffs[Object.keys(this.tariffs).length - 1];
      if (lastTariff.end >= this.formaTariff.value.start) {
        swal('Oops...', 'El rango inicial no puede ser menor o igual al último rango final', 'warning');
        return;
      }
    }

    this.tariffs.push({
      start: this.formaTariff.value.start,
      end: this.formaTariff.value.end,
      cost: this.formaTariff.value.cost
    });

    this.closeM.nativeElement.click();
    this.formaTariff.reset({
      start: 0,
      end: 0,
      cost: 0
    });
  }

  crearDestino() {
    if (this.tariffs.length <= 0 && !this.formaDestination.value._id) {
      swal('Oops...', 'Debe ingresar la tarifa del viaje', 'warning');
      return;
    }

    if (this.formaDestination.invalid) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    let destination;

    if (this.formaDestination.value._id) {
      destination = new Destination(
        this.formaDestination.value.name,
        this.formaDestination.value.type,
        this.formaDestination.value.km,
        [],
        this.formaDestination.value._id
      );
    } else {
      destination = new Destination(
        this.formaDestination.value.name,
        this.formaDestination.value.type,
        this.formaDestination.value.km,
        this.tariffs
      );
    }

    this.destinationS.crearDestino(destination)
      .subscribe((res: any) => {
        this.router.navigate(['/destinations']);
      });
  }

}
