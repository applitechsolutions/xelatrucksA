import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../services/service.index';
import { User } from '../models/user.model';

declare function init_plugins();
declare var particlesJS: any;
declare const gapi: any;

import * as $ from 'jquery';
import '../../assets/vendor/particles.js/particles.min.js';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  loading: boolean = false;
  load: any;
  email: string;
  recuerdame: boolean;
  CurYear: number;
  auth2: any;

  constructor( public router: Router, public usuarioService: UserService ) { }

  ngOnInit() {
    particlesJS.load('auth-header', 'assets/javascript/pages/particles.json');
    init_plugins();
    this.googleInit();

    this.CurYear = new Date().getFullYear();

    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 1) {
      this.recuerdame = true;
    }
  }

  googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '482115151889-1g9jcc2d7smf9achv5m1ek045absc32p.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSignin(document.getElementById('btnGoogle'));
    });
  }

  attachSignin( element ) {

    this.auth2.attachClickHandler(element, {}, (googleUser) => {
      // const profile = googleUser.getBasicProfile();
      const token = googleUser.getAuthResponse().id_token;

      this.usuarioService.loginGoogle( token )
        .subscribe( () => this.router.navigate(['/dashboard']));

    });
  }

  ingresar( forma: NgForm ) {

    if (forma.invalid) {
      return;
    }
    this.loading = true;

    const usuario = new User(null, forma.value.email, forma.value.password);

    this.usuarioService.login(usuario, forma.value.recuerdame)
      .subscribe( correcto => {
        this.router.navigate(['/dashboard']);
        this.loading = false;
      });

  }

}
