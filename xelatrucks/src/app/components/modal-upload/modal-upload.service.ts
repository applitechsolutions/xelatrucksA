import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalUploadService {

  public tipo: string;
  public id: string;

  public notificacion = new EventEmitter<any>();

  constructor() {

   }

   ocultarModal() {
      this.tipo = null;
      this.id = null;
   }

   mostrarModal(tipo: string, id: string) {
     this.id = id;
     this.tipo = tipo;
   }
}
