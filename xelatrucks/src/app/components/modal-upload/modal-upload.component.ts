import { Component, OnInit, EventEmitter } from '@angular/core';
import swal from 'sweetalert';
import { SubirArchivoService } from '../../services/subirArchivo/subir-archivo.service';
import { ModalUploadService } from './modal-upload.service';

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string | ArrayBuffer;

  constructor(
    public subirArchivoS: SubirArchivoService,
    public modalUpdoadS: ModalUploadService
  ) {

   }

  ngOnInit() {
  }

  cerrarModal() {
    this.imagenSubir = null;
    this.imagenTemp = null;

    this.modalUpdoadS.ocultarModal();
    const element: HTMLElement = document.getElementById('close') as HTMLElement;
    element.click();
  }

  seleccionImage( archivo: File ) {
    if (!archivo) {
      this.imagenSubir = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0) {
      swal('Sólo imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;
    const reader = new FileReader();
    const urlImagenTemp = reader.readAsDataURL( archivo );

    reader.onloadend = () => this.imagenTemp = reader.result;
  }

  subirImagen() {
    this.subirArchivoS.subirArchivo( this.imagenSubir, this.modalUpdoadS.tipo, this.modalUpdoadS.id )
    .then( resp => {

      this.modalUpdoadS.notificacion.emit( resp );
      this.cerrarModal();
    })
    .catch( err => {
      console.log( err );
    });
  }

}
