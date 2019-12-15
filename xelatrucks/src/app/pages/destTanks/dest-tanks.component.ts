import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DestTank } from '../../models/destTank.model';
import { DestTankService } from '../../services/service.index';

declare function init_datatables();
declare function destroy_datatables();
declare var swal: any;

@Component({
  selector: 'app-dest-tanks',
  templateUrl: './dest-tanks.component.html',
  styles: []
})
export class DestTanksComponent implements OnInit {

  destTanks: DestTank[] = [];

  constructor(
    public destTankService: DestTankService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cargarDestinos();
  }

  cargarDestinos() {
    this.destTankService.cargarDestinos()
      .subscribe( (res: any) => {
        destroy_datatables();
        this.destTanks = res.destinos;
        this.chRef.detectChanges();
        init_datatables();
      });
  }

  borrarDestino( destTank: DestTank ) {
  
    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar el destino ' + destTank.name,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {
      if (borrar) {
        destTank.state = true;
        this.destTankService.borrarDestino( destTank )
          .subscribe( () => this.cargarDestinos());
      }
    });
  }

}
