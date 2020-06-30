import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MaterialService } from 'src/app/services/service.index';
import { Material } from 'src/app/models/material.model';

declare function init_datatables();
declare function destroy_datatables();
declare var swal: any;

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styles: [
  ]
})
export class MaterialsComponent implements OnInit {

  @ViewChild('openMaterial') openMaterial: ElementRef;

  loading: boolean = false;
  materials: Material[] = [];
  material = null;
  idMaterial: string = '';

  constructor(
    public materialS: MaterialService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarMateriales();
  }

  recibirMaterial(event) {
    destroy_datatables();
    this.cargarMateriales();
  }

  cargarMateriales() {
    this.materialS.cargarCatalogo()
      .subscribe((resp: any) => {
        this.materials = resp.materiales;

        this.chRef.detectChanges();
        init_datatables();
      });
  }

  borrarMaterial(material: Material) {
    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar a ' + material.name,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          this.materialS.borrarMaterial(material._id)
            .subscribe((borrado: any) => {
              destroy_datatables();
              this.cargarMateriales();
            });
        }
      });
  }

  cargarMaterial(material: Material) {
    this.material = material;
    this.openMaterial.nativeElement.click();
  }

}
