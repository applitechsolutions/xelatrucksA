import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import swal from 'sweetalert';
import { AutoProvider } from '../../models/autoProvider.model';
import { AutoProviderService } from '../../services/autoProviders/auto-provider.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auto-provider',
  templateUrl: './auto-provider.component.html',
  styles: []
})
export class AutoProviderComponent implements OnInit {

  forma: FormGroup;
  idAutoProvider: string = '';

  constructor(
    public autoProviderS: AutoProviderService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {
    activatedRoute.params.subscribe( params => {

      const id = params.id;

      if (id !== 'new') {
        this.cargarProveedor(id);
      }
    });
  }

  ngOnInit() {
    this.forma = new FormGroup({
      name: new FormControl(null, Validators.required),
      address: new FormControl(null),
      mobile1: new FormControl(null),
      mobile2: new FormControl(null),
      email: new FormControl(null),
      account1: new FormControl(null),
      account2: new FormControl(null),
      details: new FormControl(null)
    }, {});
  }

  cargarProveedor( id: string ) {
    this.autoProviderS.cargarProveedor( id )
      .subscribe( resp => {
        this.idAutoProvider = resp._id;
        this.forma.get('name').setValue(resp.name);
        this.forma.get('address').setValue(resp.address);
        this.forma.get('mobile1').setValue(resp.mobile1);
        this.forma.get('mobile2').setValue(resp.mobile2);
        this.forma.get('email').setValue(resp.email);
        this.forma.get('account1').setValue(resp.account1);
        this.forma.get('account2').setValue(resp.account2);
        this.forma.get('details').setValue(resp.details);
      });
}

  crearProveedor() {
      console.log(this.forma.invalid);
      console.log(this.forma.value);

      if (this.forma.invalid) {
        swal('Oops...', 'Algunos campos son obligatorios', 'warning');
        return;
      }

      if (this.idAutoProvider === '') {
        const autoProvieer = new AutoProvider(
          this.forma.value.name,
          false,
          this.forma.value.address,
          this.forma.value.mobile1,
          this.forma.value.mobile2,
          this.forma.value.email,
          this.forma.value.account1,
          this.forma.value.account2,
          this.forma.value.details
        );

        this.autoProviderS.crearProveedor( autoProvieer )
          .subscribe( resp => {
            console.log(resp);
            this.router.navigate(['/autoProviders']);
          });
      } else {
        const autoProvieer = new AutoProvider(
          this.forma.value.name,
          false,
          this.forma.value.address,
          this.forma.value.mobile1,
          this.forma.value.mobile2,
          this.forma.value.email,
          this.forma.value.account1,
          this.forma.value.account2,
          this.forma.value.details,
          this.idAutoProvider
        );

        this.autoProviderS.crearProveedor( autoProvieer )
          .subscribe( resp => {
            console.log(resp);
            this.router.navigate(['/autoProviders']);
          });
      }
  }

}
