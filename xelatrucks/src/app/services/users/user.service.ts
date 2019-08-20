import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICES } from '../../config/config';
import { map, catchError } from 'rxjs/operators';
import swal from 'sweetalert';
import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';
import { throwError } from 'rxjs/internal/observable/throwError';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  usuario: User;
  token: string;
  menuTaller: any[] = [];
  menuTransporte: any[] = [];
  menuDistribucion: any[] = [];
  menuContabilidad: any[] = [];
  menuAdmin: any[] = [];

  constructor(
    public http: HttpClient,
    public Router: Router,
    public SubirAS: SubirArchivoService
    ) {
    // console.log('Servicio de usuario listo');
    this.cargarStorage();
  }

  renuevaToken() {
    const url = URL_SERVICES + '/login/renuevatoken?token=' + this.token;

    return this.http.get( url )
    .pipe(
    map( (resp: any) => {
      this.token = resp.token;
      localStorage.setItem('token', this.token );

      // console.log('TOKEN RENOVADO!!! XD');

      return true;
    }), catchError((err, caught) => {
      this.Router.navigate(['/login']);
      swal('Error de autentificación', 'El tiempo de la sesión ha caducado por favor vuelva a iniciar sesión' , 'error');
      return throwError( err );
    }));
  }

  estaLogueado() {
    return (this.token.length > 5) ? true : false;
  }

  cargarStorage() {

    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menuTaller = JSON.parse(localStorage.getItem('menuTaller'));
      this.menuTransporte = JSON.parse(localStorage.getItem('menuTransporte'));
      this.menuDistribucion = JSON.parse(localStorage.getItem('menuDistribucion'));
      this.menuContabilidad = JSON.parse(localStorage.getItem('menuContabilidad'));
      this.menuAdmin = JSON.parse(localStorage.getItem('menuAdmin'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menuTaller = [];
      this.menuTransporte = [];
      this.menuDistribucion = [];
      this.menuContabilidad = [];
      this.menuAdmin = [];
    }

  }
  // tslint:disable-next-line: max-line-length
  guardarStorage( id: string, token: string, usuario: User, menuTaller: any, menuTransporte: any, menuDistribucion: any, menuContabilidad: any, menuAdmin: any) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token );
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menuTaller', JSON.stringify(menuTaller));
    localStorage.setItem('menuTransporte', JSON.stringify(menuTransporte));
    localStorage.setItem('menuDistribucion', JSON.stringify(menuDistribucion));
    localStorage.setItem('menuContabilidad', JSON.stringify(menuContabilidad));
    localStorage.setItem('menuAdmin', JSON.stringify(menuAdmin));

    this.usuario = usuario;
    this.token = token;
    this.menuTaller = menuTaller;
    this.menuTransporte = menuTransporte;
    this.menuDistribucion = menuDistribucion;
    this.menuContabilidad = menuContabilidad;
    this.menuAdmin = menuAdmin;
  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menuTaller = [];
    this.menuTransporte = [];
    this.menuDistribucion = [];
    this.menuContabilidad = [];
    this.menuAdmin = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menuTaller');
    localStorage.removeItem('menuTransporte');
    localStorage.removeItem('menuDistribucion');
    localStorage.removeItem('menuContabilidad');
    localStorage.removeItem('menuAdmin');
    this.Router.navigate(['/login']);
  }

  loginGoogle( token: string ) {
    const url = URL_SERVICES + '/login/google';

    return this.http.post(url, {token} )
      .pipe(
        map( (resp: any) => {
        // tslint:disable-next-line: max-line-length
          this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menuTaller, resp.menuTransporte, resp.menuDistribucion, resp.menuContabilidad, resp.menuAdmin);
          return true;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal('Error al iniciar sesión', 'Credenciales incorrectas', 'error');
          return throwError( err );
        }));
  }

  login( usuario: User, recordar: boolean = false ) {

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    const url = URL_SERVICES + '/login';
    return this.http.post(url, usuario)
      .pipe( map( (resp: any) => {
        // tslint:disable-next-line: max-line-length
        this.guardarStorage(resp.id, resp.token, resp.usuario, resp.menuTaller, resp.menuTransporte, resp.menuDistribucion, resp.menuContabilidad, resp.menuAdmin);

        return true;
      }),
      catchError((err, caught) => {
        console.log(err);
        swal('Error al iniciar sesión', 'Credenciales incorrectas', 'error');
        return throwError( err );
      }));
  }

  crearUsuario( usuario: User) {

    const url = URL_SERVICES + '/usuario';

    return this.http.post(url, usuario)
      .pipe( map( (resp: any) => {
        swal('Usuario Creado', usuario.email, 'success');
        return resp;
      }),
      catchError((err, caught) => {
        console.log(err);
        swal(err.error.mensaje, err.error.errors.message , 'error');
        return throwError( err );
      }));

  }

  actualizarUsuario( usuario: User ) {
    const url = URL_SERVICES + '/usuario/' + usuario._id + '?token=' + this.token;

    return this.http.put(url, usuario)
    .pipe( map( ( resp: any) => {

      if (usuario._id === this.usuario._id) {
        const usuarioDB: User = resp.usuario;
        // tslint:disable-next-line: max-line-length
        this.guardarStorage(usuarioDB._id, this.token, usuarioDB, this.menuTaller, this.menuTransporte, this.menuDistribucion, this.menuContabilidad, this.menuAdmin);
      }

      swal('Usuario actualizado', usuario.name + ' ' + usuario.lastName, 'success');
      return true;
    }),
    catchError((err, caught) => {
      console.log(err);
      swal(err.error.mensaje, err.error.errors.message , 'error');
      return throwError( err );
    }));
  }

  cargarUsuarios(desde: number = 0) {
    const url = URL_SERVICES + '/usuario?desde=' + desde;
    return this.http.get(url);
  }

  buscarUsuarios( termino: string) {
    const url = URL_SERVICES + '/search/coleccion/users/' + termino;

    return this.http.get(url)
    .pipe(
      map( (resp: any) => resp.users),
      catchError((err, caught) => {
        console.log(err);
        swal(err.error.mensaje, err.error.errors.message , 'error');
        return throwError( err );
      }));
  }

  cambiarImagen( file: File, id: string ) {

    this.SubirAS.subirArchivo( file, 'users', id)
    .then( (resp: any) => {
      // console.log(resp);
      this.usuario.img = resp.usuario.img;
      swal('Foto actualizada', this.usuario.name + ' ' + this.usuario.lastName, 'success');
      // tslint:disable-next-line: max-line-length
      this.guardarStorage( id, this.token, this.usuario, this.menuTaller, this.menuTransporte, this.menuDistribucion, this.menuContabilidad, this.menuAdmin);
    })
    .catch( err => {
      console.log(err);
    });
  }

  borrarUsuario( id: string) {
    let url = URL_SERVICES + '/usuario/delete/' + id;
    url += '?token=' + this.token;

    return this.http.put(url, '')
      .pipe(
        map( resp => {
          swal('Usuario borrado', 'El usuario ha sido eliminado correctamente', 'success');
          return true;
        }),
        catchError((err, caught) => {
          console.log(err);
          swal(err.error.mensaje, err.error.errors.message , 'error');
          return throwError( err );
        }));
  }

}
