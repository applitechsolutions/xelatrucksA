import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DestTank } from '../../models/destTank.model';
import { DestTankService } from '../../services/service.index';

declare var swal: any;

@Component({
  selector: 'app-dest-tank',
  templateUrl: './dest-tank.component.html',
  styles: []
})
export class DestTankComponent implements OnInit {

  formDT: FormGroup;
  destTank: DestTank = { name: '', km: 0 };

  constructor(
    public router: Router,
    public destTankService: DestTankService,
    public activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe(params => {

      const id = params.id;

      if (id !== 'new') {
        this.cargarDestino(id);
      }

    });
  }

  ngOnInit() {

    this.formDT = new FormGroup({
      name: new FormControl('', Validators.required),
      km: new FormControl(0, Validators.required)
    });
  }

  cargarDestino( id: string ) {
    
    this.destTankService.cargarDestino( id )
      .subscribe( (res: any ) => {
        console.log(res);
        this.destTank = res.destino;
        this.formDT.get('name').setValue(this.destTank.name);
        this.formDT.get('km').setValue(this.destTank.km);
      });
  }

  crearDestino() {
    
    if (this.formDT.invalid) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    let destTank;

    if (this.destTank._id) {
      destTank = new DestTank(
        this.formDT.value.name,
        this.formDT.value.km,
        this.destTank._id
      )
    } else {
      destTank = new DestTank(
        this.formDT.value.name,
        this.formDT.value.km
      )
    }

    this.destTankService.crearDestino( destTank )
      .subscribe(() => this.router.navigate(['/destTanks']))
  }

}
