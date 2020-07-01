import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MissingSurplus } from '../../models/missingsurplus.model';
import { UserService, MaterialService, CdStorageService, DatatablesService } from 'src/app/services/service.index';
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

  @ViewChild('closeMEx') closeMEx: ElementRef;

  formExcesos: FormGroup

  loading = false;
  materials: any[] = [];
  material: any;
  missings: any[] = [];
  name: string = '';
  type: boolean;

  constructor(
    public userService: UserService,
    public cdStorageS: CdStorageService,
    public materialS: MaterialService,
    public dtService: DatatablesService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarStorage();

    this.formExcesos = new FormGroup({
      load: new FormControl(0, Validators.required),
      description: new FormControl('', Validators.required)
    });
  }

  cargarModalExcesos(material: any, type: boolean) {
    this.material = material;
    this.type = type;
    if (this.userService.usuario.role === 'ADMIN_ROLE') {
      type ? this.name = 'Crear faltante' : this.name = 'Crear sobrante';
    } else {
      type ? this.name = 'Solicitar faltante' : this.name = 'Solicitar sobrante';
    }
  }

  crearExceso() {
    if (this.formExcesos.invalid) {
      swal('Ooops...', 'Algunos campos son obligatorios', 'warning');
      return false;
    }

    if (this.userService.usuario.role === 'ADMIN_ROLE') {
      const missingsurplus = new MissingSurplus(
        this.type,
        this.formExcesos.value.load,
        this.userService.usuario,
        this.material._material,
        this.formExcesos.value.description,
        this.material._id,
        'confirmado'
      );

      this.cdStorageS.crearExceso(missingsurplus, true)
        .subscribe((res: any) => {
          this.cargarStorage();
          this.closeMEx.nativeElement.click();
        });
    } else {
      const missingsurplus = new MissingSurplus(
        this.type,
        this.formExcesos.value.load,
        this.userService.usuario,
        this.material._material,
        this.formExcesos.value.description,
        this.material._id,
        'pendiente'
      );

      this.cdStorageS.crearExceso(missingsurplus, false)
        .subscribe((res: any) => {
          this.closeMEx.nativeElement.click();
        });
    }
    this.formExcesos.reset();
  }

  finalizarExceso(missingsurplus: MissingSurplus, isGood: boolean, name: string) {
    const title = isGood ? 'confirmar' : 'rechazar';
    const message = isGood ? 'esto afectará el inventario' : 'se perderá esta información'
    swal({
      title: '¿Está seguro?',
      text: `Esta a punto de ${title} un ${name}, ${message}`,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(finalizar => {
        if (finalizar) {
          if (isGood) {
            missingsurplus.state = 'confirmado';
            this.cdStorageS.finalizarExceso(missingsurplus, isGood)
              .subscribe((res: any) => {
                const type = res.surpmiss.type;
                this.cargarExcesos(type)
                swal({
                  title: 'Exito!',
                  text: `${name} confirmado con éxito`,
                  icon: 'success',
                  button: false,
                  timer: 1000
                });
              });
          } else {
            missingsurplus.state = 'rechazado';
            this.cdStorageS.finalizarExceso(missingsurplus, isGood)
              .subscribe((res: any) => {
                const type = res.surpmiss.type;
                this.cargarExcesos(type)
                swal({
                  title: 'Exito!',
                  text: `${name} rechazado con éxito`,
                  icon: 'success',
                  button: false,
                  timer: 1000
                });
              });
          }
        }
      });
  }

  cargarStorage() {
    this.materialS.cargarInventario().subscribe((resp: any) => {
      this.materials = resp.materiales;

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
