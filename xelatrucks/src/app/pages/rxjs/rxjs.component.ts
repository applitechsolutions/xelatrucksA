import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { retry, map, filter } from 'rxjs/operators';


@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: []
})
export class RxjsComponent implements OnInit, OnDestroy {

  subscription: Subscription;

  constructor() {

    this.subscription = this.regresarObservable()
      .subscribe(
      numero => console.log('Subs', numero),
      error => console.error('Error en el obs', error),
      () => console.log('Completado')
     );

  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  regresarObservable(): Observable<any> {
    return new Observable( observer => {

      let contador = 0;

      const intervalo = setInterval( () => {

        contador += 1;

        const salida = {
          valor: contador
        };

        observer.next( salida );

        // if (contador === 3) {
        //   clearInterval(intervalo);
        //   observer.complete();
        // }

        // if (contador === 2) {
        //   observer.error('Auxilio!');
        // }

      }, 500);

    })
    .pipe(
      retry(2),
      map( (resp: any) => {
        return resp.valor;
      }),
      filter( (valor => {

        if (valor % 2 === 1 ) {
          // impar
          return true;
        } else {
          // par
          return false;
        }

      }))
      );
  }

}
