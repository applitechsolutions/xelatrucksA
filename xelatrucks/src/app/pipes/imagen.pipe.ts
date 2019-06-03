import { Pipe, PipeTransform } from '@angular/core';
import { URL_SERVICES } from '../config/config';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transform(img: string, tipo: string = 'users'): any {

    let url = URL_SERVICES + '/img';

    if (!img) {
      return url + '/users/xxx';
    }

    // Para USUARIOS DE GOOGLE
    if (img.indexOf('https') >= 0) {
      return img;
    }

    switch (tipo) {
      case 'users':
        url += '/users/' + img;
        break;
      default:
        console.log('El tipo de usuario no existe XD');
        url += '/users/xxx';
        break;
    }

    return url;
  }

}
