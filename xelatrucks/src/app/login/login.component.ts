import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  constructor( public router: Router ) { }

  ngOnInit() {
    particlesJS.load('auth-header', '../../assets/javascript/pages/particles.json');
    init_plugins();
  }

  ingresar() {
    console.log('Ingresando...');
    this.router.navigate(['/dashboard']);
  }
}
