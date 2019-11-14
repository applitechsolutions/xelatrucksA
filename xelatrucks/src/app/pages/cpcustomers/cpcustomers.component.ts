import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CPcustomerService } from '../../services/CPcustomers/cpcustomer.service';
import { CPCustomer } from '../../models/CPcustomer.model';

declare function init_datatables();
declare function destroy_datatables();
declare var swal: any;

@Component({
  selector: 'app-cpcustomers',
  templateUrl: './cpcustomers.component.html',
  styles: []
})
export class CpcustomersComponent implements OnInit {

  @ViewChild('closeM', { static: false }) closeM: ElementRef;

  loading: boolean = false;
  CPcustomers: CPCustomer[] = [];
  forma: FormGroup;
  idCPCustomer: string = '';

  constructor(
    public cpCustomerS: CPcustomerService,
    private chRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cargarClientes();
    this.forma = new FormGroup({
      name: new FormControl(null, Validators.required),
      nit: new FormControl(null),
      address: new FormControl(null),
      mobile: new FormControl(null)
    }, {});
  }

  cargarClientes() {
    this.cpCustomerS.cargarClientes()
      .subscribe( (resp: any) => {
        this.CPcustomers = resp.clientes;

        this.chRef.detectChanges();
        init_datatables();
      });
  }

  borrarCliente( CPcustomer: CPCustomer) {
    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar a ' + CPcustomer.name,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
    .then( borrar => {
      if (borrar) {
        this.cpCustomerS.borrarCliente( CPcustomer._id )
          .subscribe( (borrado: any) => {
            destroy_datatables();
            this.cargarClientes();
          });
      }
    });
  }

  cargarCliente( id: string ) {
    this.cpCustomerS.cargarCliente( id )
      .subscribe( resp => {
        this.idCPCustomer = resp._id;
        this.forma.get('name').setValue(resp.name);
        this.forma.get('nit').setValue(resp.nit);
        this.forma.get('address').setValue(resp.address);
        this.forma.get('mobile').setValue(resp.mobile);
      });
  }

  crearCliente() {
    if (this.forma.invalid) {
      swal('Oops...', 'Algunos campos son obligatorios', 'warning');
      return;
    }

    this.loading = true;

    if (this.idCPCustomer === '') {
      const CPcustomer = new CPCustomer(
        this.forma.value.name,
        false,
        this.forma.value.nit,
        this.forma.value.address,
        this.forma.value.mobile
      );

      this.cpCustomerS.crearCliente( CPcustomer )
        .subscribe( resp => {
          destroy_datatables();
          this.cargarClientes();
          this.closeM.nativeElement.click();
          this.loading = false;
        });
      } else {
        const CPcustomer = new CPCustomer(
          this.forma.value.name,
          false,
          this.forma.value.nit,
        this.forma.value.address,
        this.forma.value.mobile,
        this.idCPCustomer
        );

        this.cpCustomerS.crearCliente( CPcustomer )
        .subscribe( resp => {
          destroy_datatables();
          this.cargarClientes();
          this.closeM.nativeElement.click();
          this.loading = false;
          this.idCPCustomer = '';
        });
      }
    this.forma.reset();
  }

}
