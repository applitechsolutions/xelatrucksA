import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModalUploadService } from '../components/modal-upload/modal-upload.service';

import {
  SharedService,
  SidebarService,
  UserService,
  LoginGuardGuard,
  SubirArchivoService,
  DatatablesService
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
    DatatablesService
  ]
})
export class ServiceModule { }
