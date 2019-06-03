import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/users/user.service';
import { User } from '../../models/user.model';
import swal from 'sweetalert';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  usuario: User;
  role: string;

  imagenSubir: File;
  imagenTemp: string;

  constructor(public userS: UserService) { }

  ngOnInit() {
    this.usuario = this.userS.usuario;
    if (this.usuario.role === 'ADMIN_ROLE') {
      this.role = 'Administrador';
    } else {
      this.role = 'Operativo';
    }
  }

  guardar( usuario: User){
    this.usuario.name = usuario.name;
    this.usuario.lastName = usuario.lastName;
    this.usuario.email = usuario.email;

    this.userS.actualizarUsuario( this.usuario )
    .subscribe();
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

  cambiarImagen() {
    this.userS.cambiarImagen(this.imagenSubir, this.usuario._id);
  }

}
