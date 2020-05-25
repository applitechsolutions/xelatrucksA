import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customers/customer.service';
import { Customer } from '../../models/customer.model';

declare function init_datatables();
declare function destroy_datatables();
declare var swal: any;
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styles: []
})
export class CustomersComponent implements OnInit {

  @ViewChild('closeM') closeM: ElementRef;

  loading: boolean = false;
  customers: Customer[] = [];
  forma: FormGroup;
  idCustomer: string = '';

  constructor(
    public CustomerS: CustomerService,
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
    this.CustomerS.cargarClientes()
      .subscribe((resp: any) => {
        this.customers = resp.clientes;

        this.chRef.detectChanges();
        init_datatables();
      });
  }

  borrarCliente(customer: Customer) {
    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar a ' + customer.name,
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    })
      .then(borrar => {
        if (borrar) {
          this.CustomerS.borrarCliente(customer._id)
            .subscribe((borrado: any) => {
              destroy_datatables();
              this.cargarClientes();
            });
        }
      });
  }

  cargarCliente(id: string) {
    this.CustomerS.cargarCliente(id)
      .subscribe(resp => {
        this.idCustomer = resp._id;
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

    if (this.idCustomer === '') {
      const customer = new Customer(
        this.forma.value.name,
        false,
        this.forma.value.nit,
        this.forma.value.address,
        this.forma.value.mobile
      );

      this.CustomerS.crearCliente(customer)
        .subscribe(resp => {
          destroy_datatables();
          this.cargarClientes();
          this.closeM.nativeElement.click();
          this.loading = false;
        });
    } else {
      const customer = new Customer(
        this.forma.value.name,
        false,
        this.forma.value.nit,
        this.forma.value.address,
        this.forma.value.mobile,
        this.idCustomer
      );

      this.CustomerS.crearCliente(customer)
        .subscribe(resp => {
          destroy_datatables();
          this.cargarClientes();
          this.closeM.nativeElement.click();
          this.loading = false;
          this.idCustomer = '';
        });
    }
    this.forma.reset();
  }

}
