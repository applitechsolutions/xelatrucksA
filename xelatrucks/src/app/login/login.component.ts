import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare function init_plugins();
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit {

  constructor( public router: Router ) { }

  ngOnInit() {
    init_plugins();
  }

  ingresar() {
    console.log('Ingresando...');
    this.router.navigate(['/dashboard']);
  }
}
