import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Type } from '../../models/type.model';
import { Tariff } from '../../models/tariff.model';
import { TypeTripService } from '../../services/service.index';

declare var swal: any;

@Component({
  selector: 'app-type-trip',
  templateUrl: './type-trip.component.html',
  styles: []
})
export class TypeTripComponent implements OnInit {

  @ViewChild('closeM', {static: false}) closeM: ElementRef;

  formTT: FormGroup;
  formTariff: FormGroup;
  typetrip: Type = new Type('', '', 0, null);
  tariff: Tariff;
  tariffs: Tariff[] = [];

  constructor(
    public router: Router,
    public typeService: TypeTripService,
    public activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe( params => {

      const id = params.id;

      if (id !== 'new') {
        this.cargarType(id);
      }

    });
  }

  ngOnInit() {
    this.formTT = new FormGroup({
      code: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      km: new FormControl(0, Validators.required)
    });

    this.formTariff = new FormGroup({
      start: new FormControl(0, Validators.required),
      end: new FormControl(0, Validators.required),
      cost: new FormControl(0, Validators.required)
    });
  }

  resetModal() {
    this.formTariff.reset();
  }

  cargarType( id: string ) {

    this.typeService.cargarType( id )
      .subscribe((res: any) => {
        this.typetrip = res.tipoviaje;
        this.formTT.get('code').setValue(this.typetrip.code);
        this.formTT.get('name').setValue(this.typetrip.name);
        this.formTT.get('km').setValue(this.typetrip.km);

        // this.tariffs = this.typetrip.tariff;
      });
  }

  borrarTarifa( tarifa: Tariff ) {
    const index = this.tariffs.indexOf(tarifa);
    this.tariffs.splice(index, 1);
  }

  agregarTarifa() {

    if (this.formTariff.value.start >= this.formTariff.value.end) {
      swal('Oops...', 'El rango inicial no puede ser mayor o igual al rango final', 'warning');
      return;
    }

    if (this.tariffs.length > 0) {

      const lastTariff = this.tariffs[Object.keys(this.tariffs).length - 1];
      if (lastTariff.end >= this.formTariff.value.start) {
        swal('Oops...', 'El rango inicial no puede ser menor o igual al último rango final', 'warning');
        return;
      }
    }

    this.tariffs.push({
      start: this.formTariff.value.start,
      end: this.formTariff.value.end,
      cost: this.formTariff.value.cost
    });

    this.closeM.nativeElement.click();
    this.resetModal();
  }

  crearTipoV() {

    if ( this.tariffs.length <= 0 && !this.typetrip._id ) {
      swal('Oops...', 'Debe ingresar la tarifa del viaje', 'warning');
      return;
    }

    if (this.formTT.invalid) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    let typeTrip;

    if (this.typetrip._id) {
      typeTrip = new Type (
        this.formTT.value.code,
        this.formTT.value.name,
        this.formTT.value.km,
        this.tariffs,
        this.typetrip._id
      );

    } else {
      typeTrip = new Type (
        this.formTT.value.code,
        this.formTT.value.name,
        this.formTT.value.km,
        this.tariffs
      );
    }

    this.typeService.crearTypes( typeTrip )
      .subscribe( () => this.router.navigate(['/typeTrips']) );
  }

}
