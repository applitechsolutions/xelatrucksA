import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatatablesService } from '../../services/datatables/datatables.service';
import { AutoProviderService } from '../../services/autoProviders/auto-provider.service';
import { AutoProvider } from '../../models/autoProvider.model';

declare function init_datatables();
declare function destroy_datatables();
declare var swal: any;

@Component({
  selector: 'app-auto-providers',
  templateUrl: './auto-providers.component.html',
  styles: []
})
export class AutoProvidersComponent implements OnInit {

  autoProviders: AutoProvider[] = [];

  constructor(
    public autoProviderS: AutoProviderService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cargarProveedores();
  }

  cargarProveedores() {
    this.autoProviderS.cargarProveedores()
      .subscribe( (resp: any) => {
        this.autoProviders = resp.proveedores;

        this.chRef.detectChanges();
        init_datatables();
      });
  }

  borrarProveedor( autoProvider: AutoProvider ) {

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar a ' + autoProvider.name,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {
      if (borrar) {
        this.autoProviderS.borrarProveedor( autoProvider._id )
          .subscribe( (borrado: any) => {
            destroy_datatables();
            this.cargarProveedores();
          });
      }
    });
  }

}
