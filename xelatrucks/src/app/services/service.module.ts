import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import {
  SharedService,
  SidebarService,
  UserService,
  DynamicScriptLoaderServiceService
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
    DynamicScriptLoaderServiceService
  ]
})
export class ServiceModule { }
