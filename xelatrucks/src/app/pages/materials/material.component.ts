import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MaterialService } from 'src/app/services/service.index';
import { Material } from '../../models/material.model';

declare var swal: any;
@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styles: [
  ]
})
export class MaterialComponent implements OnInit, OnChanges {
  @ViewChild('closeMMt') closeMMt: ElementRef;
  @Input() material: Material;
  @Output() enviarMaterial = new EventEmitter();

  formMat: FormGroup;
  tempMat: string = '';

  constructor(public matService: MaterialService) { }

  ngOnInit(): void {
    this.formMat = new FormGroup({
      _id: new FormControl(''),
      code: new FormControl(''),
      name: new FormControl('', Validators.required),
      minStock: new FormControl(0, Validators.required),
      cost: new FormControl(0, Validators.required),
      price: new FormControl(0, Validators.required),
      isCD: new FormControl(false, Validators.required),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (this.material && changes.material) {
      const material = changes.material.currentValue;
      this.formMat.get('_id').setValue(material._id);
      this.formMat.get('code').setValue(material.code);
      this.formMat.get('name').setValue(material.name);
      this.formMat.get('minStock').setValue(material.minStock);
      this.formMat.get('cost').setValue(material.cost);
      this.formMat.get('price').setValue(material.price);
      this.formMat.get('isCD').setValue(material.isCD);
    }
  }

  crearMaterial() {

    if (this.formMat.invalid) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    let material;

    if (this.formMat.value._id === '') {
      material = new Material(
        this.formMat.value.code,
        this.formMat.value.name,
        this.formMat.value.minStock,
        this.formMat.value.cost,
        this.formMat.value.price,
        this.formMat.value.isCD
      );
    } else {
      material = new Material(
        this.formMat.value.code,
        this.formMat.value.name,
        this.formMat.value.minStock,
        this.formMat.value.cost,
        this.formMat.value.price,
        this.formMat.value.isCD,
        this.formMat.value._id
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
