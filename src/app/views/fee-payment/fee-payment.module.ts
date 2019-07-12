import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from '@angular/common';
import { FeePaymentRoutingModule } from './fee-payment-routing.module';
import { NgDatepickerModule } from 'ng2-datepicker';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../../shared/ngb-date-customparser';
import { NgxPrintModule } from 'ngx-print';
import { DatePipe } from '@angular/common';

import {
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';

import { FeePaymentComponent } from './fee-payment.component';
import { ExpenseComponent } from './expense/expense.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [FeePaymentComponent, ExpenseComponent],
  imports: [
    CommonModule,
    FeePaymentRoutingModule,
    ChartsModule,
    BsDropdownModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgDatepickerModule,
    NgbModule,
    NgxPrintModule
  ],
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }, DatePipe
  ]
})
export class FeePaymentModule { }
