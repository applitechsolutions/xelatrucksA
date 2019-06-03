import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../services/service.index';
import { User } from '../models/user.model';

declare function init_plugins();

import * as $ from 'jquery';
import '../../assets/vendor/particles.js/particles.min.js';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  particlesJS: any;
  load: any;
  email: string;
  recuerdame: boolean;
  CurYear: number;

  constructor( public router: Router, public usuarioService: UserService ) { }

  ngOnInit() {
    particlesJS.load('auth-header', '../../assets/javascript/pages/particles.json');
    init_plugins();

    this.CurYear = new Date().getFullYear();

    this.email = localStorage.getItem('email') || '';
    if (this.email.length > 1) {
      this.recuerdame = true;
    }
  }

  ingresar( forma: NgForm ) {

    if (forma.invalid) {
      return;
    }

    const usuario = new User(null, forma.value.email, forma.value.password);

    this.usuarioService.login(usuario, forma.value.recuerdame)
      .subscribe( correcto => this.router.navigate(['/dashboard']));

  }
}
