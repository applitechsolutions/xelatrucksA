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
  loading = false;

  constructor(
    public subirArchivoS: SubirArchivoService,
    public modalUploadS: ModalUploadService
  ) {

   }

  ngOnInit() { }

  cerrarModal() {
    this.imagenSubir = null;
    this.imagenTemp = null;

    this.modalUploadS.ocultarModal();
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
    this.loading = true;
    this.subirArchivoS.subirArchivo( this.imagenSubir, this.modalUploadS.tipo, this.modalUploadS.id )
    .then( resp => {
      this.loading = false;
      this.modalUploadS.notificacion.emit( resp );
      this.cerrarModal();
    })
    .catch( err => {
      this.loading = false;
      console.log( err );
    });
  }

}
