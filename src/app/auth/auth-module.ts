import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing-module';
import { MaterialModule } from '../material/material-module';
import { Login } from './login/login';
import { Register } from './register/register';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialModule
  ]
})
export class AuthModule { }
