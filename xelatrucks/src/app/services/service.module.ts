import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';
import { VerificaTokenGuard } from './guards/verifica-token.guard';

import {
  SharedService,
  SidebarService,
  UserService,
  LoginGuardGuard,
  AdminGuard,
  SubirArchivoService,
  DatatablesService,
  PartService,
  PitService,
  MechanicService,
  VehicleService,
  GondolaService,
  MaintenanceService,
  EmployeeService,
  TripService,
  GbillService,
  CPcustomerService,
  MaterialService,
  TypeMaintenanceService,
  TypeTripService
} from './service.index';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    SharedService,
    SidebarService,
    UserService,
    LoginGuardGuard,
    AdminGuard,
    SubirArchivoService,
    ModalUploadService,
    DatatablesService,
    PartService,
    PitService,
    MechanicService,
    VehicleService,
    GondolaService,
    MaintenanceService,
    EmployeeService,
    TripService,
    GbillService,
    CPcustomerService,
    TypeMaintenanceService,
    TypeTripService,
    MaterialService,
    VerificaTokenGuard
  ]
})
export class ServiceModule { }
