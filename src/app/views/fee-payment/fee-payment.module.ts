import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from '@angular/common';
import { FeePaymentRoutingModule } from './fee-payment-routing.module';
import {
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';

import { FeePaymentComponent } from './fee-payment.component'

@NgModule({
  declarations: [FeePaymentComponent],
  imports: [
    CommonModule,
    FeePaymentRoutingModule,
    ChartsModule,
    BsDropdownModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class FeePaymentModule { }
