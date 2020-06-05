import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Material } from '../../models/material.model';
import { MaterialService } from "../../services/service.index";

declare var swal: any;
@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styles: [
  ]
})
export class MaterialComponent implements OnInit {
  @ViewChild('closeMMt') closeMMt: ElementRef;
  @Output() enviarMaterial = new EventEmitter();

  material: Material = { code: '', name: '', minStock: 0, price: 0 };
  formMat: FormGroup;
  tempMat: string = '';

  constructor(public matService: MaterialService) { }

  ngOnInit(): void {
    this.formMat = new FormGroup({
      code: new FormControl(0),
      name: new FormControl('', Validators.required),
      minStock: new FormControl(0, Validators.required),
      price: new FormControl(0, Validators.required)
    });
  }

  crearMaterial() {

    if (this.formMat.invalid) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    let material;

    if (this.material._id) {
      material = new Material(
        this.formMat.value.code,
        this.formMat.value.name,
        this.formMat.value.minStock,
        this.formMat.value.price,
        this.material._id
      );
    } else {
      material = new Material(
        this.formMat.value.code,
        this.formMat.value.name,
        this.formMat.value.minStock,
        this.formMat.value.price
      );
    }

    this.matService.crearMaterial(material)
      .subscribe((res: any) => {
        swal({
          title: 'Exito!',
          text: 'Material creado correctamente' + res.material.code + ' ' + res.material.name,
          icon: 'success',
          button: false,
          timer: 1500
        });
        this.enviarMaterial.emit(res.material);
        this.tempMat = res.material._id;
        this.formMat.reset();
        this.closeMMt.nativeElement.click();
      });
  }

}
