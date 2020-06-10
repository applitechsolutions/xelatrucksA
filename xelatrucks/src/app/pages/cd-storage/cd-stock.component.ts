import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MissingSurplus } from '../../models/missingsurplus.model';
import { MaterialService, CdStorageService } from 'src/app/services/service.index';
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
  missings: MissingSurplus[] = [];

  constructor(
    public cdStorageS: CdStorageService,
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
      destroy_datatables();
      this.chRef.detectChanges();
      init_datatables();
    });
  }

  cargarExcesos(type: boolean) {
    this.cdStorageS.cargarExcesos(type).subscribe((res: any) => {
      this.loading = true;
      this.missings = res.excesos
      destroy_datatables();
      this.chRef.detectChanges();
      init_datatables();
      console.log(res);
    }, ((err: any) => {
      this.loading = false;
    }));
  }

}
