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
  SubirArchivoService,
  DatatablesService,
  PartService,
  PitService,
  MechanicService
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
    SubirArchivoService,
    ModalUploadService,
    DatatablesService,
    PartService,
    PitService,
    MechanicService,
    VerificaTokenGuard
  ]
})
export class ServiceModule { }
