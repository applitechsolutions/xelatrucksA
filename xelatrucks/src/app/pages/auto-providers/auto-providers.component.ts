import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatatablesService } from '../../services/datatables/datatables.service';
import { AutoProviderService } from '../../services/autoProviders/auto-provider.service';
import { AutoProvider } from '../../models/autoProvider.model';

declare var swal: any;

@Component({
  selector: 'app-auto-providers',
  templateUrl: './auto-providers.component.html',
  styles: []
})
export class AutoProvidersComponent implements OnInit {

  autoProviders: AutoProvider[] = [];

  constructor(
    public dtS: DatatablesService,
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

        this.dtS.init_tables();
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
            this.dtS.destroy_table();

            this.cargarProveedores();
          });
      }
    });
  }

}
