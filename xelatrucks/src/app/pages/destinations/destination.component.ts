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

  formaDestination: FormGroup;

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
      km: new FormControl('', Validators.required),
      tariff: new FormControl('', Validators.required)
    });
  }

  cargarType(id: string) {

    this.destinationS.cargarDestino(id)
      .subscribe(resp => {
        this.formaDestination.get('_id').setValue(resp._id);
        this.formaDestination.get('type').setValue(resp.type);
        this.formaDestination.get('name').setValue(resp.name);
        this.formaDestination.get('km').setValue(resp.km);
        this.formaDestination.get('tariff').setValue(resp.tariff);
      });
  }

  crearDestino() {

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
        this.formaDestination.value.tariff,
        this.formaDestination.value._id
      );
    } else {
      destination = new Destination(
        this.formaDestination.value.name,
        this.formaDestination.value.type,
        this.formaDestination.value.km,
        this.formaDestination.value.tariff
      );
    }

    this.destinationS.crearDestino(destination)
      .subscribe((res: any) => {
        this.router.navigate(['/destinations']);
      });
  }

}
