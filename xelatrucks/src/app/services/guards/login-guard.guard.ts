import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../users/user.service';



@Injectable({
  providedIn: 'root'
})
export class LoginGuardGuard implements CanActivate {

  constructor(public router: Router, public usuarioService: UserService) {
  }

  canActivate() {

    if ( this.usuarioService.estaLogueado() ) {
       console.log('PASO EL PROVOCAR');
       return true;
    } else {
      console.log('TAL VEZ TRADEA');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
