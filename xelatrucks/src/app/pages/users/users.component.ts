import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import { AreaService } from '../../services/areas/area.service';
import { UserArea } from 'src/app/models/userArea.model';
import { Area } from '../../models/area.model';
import { map } from 'rxjs/operators';

declare var swal: any;

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: []
})
export class UsersComponent implements OnInit {

  usuarios: User[] = [];
  userAreas: UserArea[] = [];
  areas: Area[] = [];
  area = {
    _id: '',
    nombre: ''
  };
  user: string = '';

  desde: number = 0;
  totalRegistros: number = 0;
  cargando: boolean = true;
  modalTitle: string = 'Áreas asignadas';

  constructor(
    public UsuarioService: UserService,
    public modalUploadS: ModalUploadService,
    public areaS: AreaService
    ) { }

  ngOnInit() {
    this.cargarUsuarios();

    this.modalUploadS.notificacion
        .subscribe( resp => this.cargarUsuarios());

    this.cargarAreas();
  }

  // CARGAR LISTADOS

  cargarAreas() {
    this.areaS.cargarAreas()
    .subscribe( (resp: any) => {
    this.areas = resp.areas;
    });
  }

  cargarUsuarios() {
    this.cargando = true;

    this.UsuarioService.cargarUsuarios(this.desde)
    .subscribe( (resp: any) => {
    this.totalRegistros = resp.total;
    this.usuarios = resp.usuarios;
    this.cargando = false;
    });
  }

  // TABLA

  cambiarDesde(valor: number) {
    const desde = this.desde + valor;

    if (desde >= this.totalRegistros) {
      return;
    }

    if (desde < 0) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();
  }

  buscarUsuarios( termino: string){

    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this.UsuarioService.buscarUsuarios(termino)
      .subscribe( (usuarios: User[]) => {
        this.usuarios = usuarios;
        this.cargando = false;
    });
  }

  borrarUsuario(usuario: User) {
    if (usuario._id === this.UsuarioService.usuario._id) {
      swal('No puede borrar usuario', 'No se puede borrar a si mismo', 'error');
      return;
    }

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar a ' + usuario.name + ' ' + usuario.lastName,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {

      if (borrar) {
        this.UsuarioService.borrarUsuario(usuario._id)
          .subscribe((borrado: any) => {
            this.cargarUsuarios();
            if ((this.totalRegistros - 1) <= this.desde) {
              this.cambiarDesde(-(this.totalRegistros - 1));
            }
          });
      }

    });
  }

  // ACTUALIZAR ROLE

  actualizarRol( usuario: User ) {
    this.UsuarioService.actualizarUsuario( usuario )
    .subscribe();
  }

  // ACTUALIZAR FOTO

  mostrarModal(id: string) {
    this.modalUploadS.mostrarModal( 'users' , id );
  }

  // ACTUALIZAR AREAS

  abrirModal(user: string, name: string) {
    this.modalTitle = name;
    this.user = user;

    this.mostrarAreas( user );
  }

  mostrarAreas(user: string) {
    this.areaS.cargarUserAreas(user)
      .subscribe( (resp: any) => {
        this.userAreas = resp;
        console.log(this.userAreas);
        console.log(this.userAreas.map( (resp: any) => resp._area ));
      });
  }

  addArea(user: string) {
    if (this.areas && this.area._id) {
      const status: Area = this.areas.find(s => s._id === this.area._id);
      if (status) {
          if (this.userAreas.map( (resp: any) => resp._area ).find(e => e._id === status._id)) {
            return;
          } else {
              this.userAreas.push({
                _area: {
                  _id: status._id,
                  name: status.name
              },
                _user: user
              });
          }
      }
    }
    console.log(this.userAreas);
  }

  deleteArea(idArea: string) {

    const areas: Area[] = this.userAreas.map( (resp: any) => resp._area );
    areas.forEach( (area, index) => {
      if (area._id === idArea) {
        this.userAreas.splice(index, 1);
      }
    });
}

crearUsuario() {

  if (this.userAreas.length === 0) {
    swal('Oops...', 'Por favor asigna al menos un área', 'warning');
    return;
  }

  const areas: Area[] = this.userAreas.map( (resp: any) => resp._area );

  this.areaS.crearUserArea( areas, this.user )
  .subscribe();

  const element: HTMLElement = document.getElementById('close') as HTMLElement;
  element.click();

}

}
