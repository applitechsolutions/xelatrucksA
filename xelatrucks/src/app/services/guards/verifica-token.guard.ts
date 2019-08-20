import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../users/user.service';

@Injectable({
  providedIn: 'root'
})
export class VerificaTokenGuard implements CanActivate {

  constructor (
    public userS: UserService,
    public router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // console.log('VERIFICA TOKEN GUARD');

    const token = this.userS.token;
    const payload = JSON.parse( atob( token.split('.')[1]) );
    // console.log(payload);

    const expirado = this.expirado( payload.exp );

    if (expirado) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.verificaRenueva( payload.exp );
  }

  verificaRenueva( fechaExp: number ): Promise<boolean> {
    return new Promise( (resolve, reject) => {
      const tokenExp = new Date( fechaExp * 1000 );
      const ahora = new Date();

      ahora.setTime( ahora.getTime() + ( 0.5 * 60 * 60 * 1000));
      // console.log(tokenExp);
      // console.log(ahora);

      if (tokenExp.getTime() > ahora.getTime()) {
          resolve( true );
      } else {
        // console.log('RENUEVA');
        this.userS.renuevaToken()
          .subscribe( () => {
            resolve( true );
          }, () => {
            reject( false );
            this.router.navigate(['/login']);
          });
      }

      resolve( true );
    });
  }

  expirado( fechaExp: number ) {
      const ahora = new Date().getTime() / 1000;

      if (fechaExp < ahora) {
        return true;
      } else {
        return false;
      }
  }
}
