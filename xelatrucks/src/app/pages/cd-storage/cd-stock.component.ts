import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MaterialService } from 'src/app/services/service.index';

declare function init_datatables();
declare function destroy_datatables();
declare var swal: any;

@Component({
  selector: 'app-cd-stock',
  templateUrl: './cd-stock.component.html',
  styles: [
  ]
})
export class CdStockComponent implements OnInit {

  loading = false;
  materials: any[] = [];

  constructor(
    public materialS: MaterialService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarStorage();
  }

  cargarStorage() {
    this.materialS.cargarMateriales().subscribe((resp: any) => {
      resp.materiales
        .map((res: any) => {
          this.materials = res.storage;
        });

      this.chRef.detectChanges();
      init_datatables();
    });
  }

}
