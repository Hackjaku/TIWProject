import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing-module';
import { MaterialModule } from '../material/material-module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    MaterialModule
  ]
})
export class PrivateModule { }
