import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../users/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    public userS: UserService
  ) {}

  canActivate() {

    if (this.userS.usuario.role === 'ADMIN_ROLE') {
      return true;
    } else {
      console.log('Bloqueado por el ADMIN GUARD');
      this.userS.logout();
      return false;
    }

  }

}
