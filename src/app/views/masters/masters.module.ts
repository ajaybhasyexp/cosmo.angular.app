import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from '@angular/common';
import { FormGroup , FormControl , ReactiveFormsModule , FormsModule } from '@angular/forms';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MastersComponent } from './masters.component';
import { MastersRoutingModule } from './masters-routing.module';
import { ExpenseMastersComponent } from '../expense-masters/expense-masters.component';

@NgModule({
  imports: [
    MastersRoutingModule,
    ChartsModule,
    BsDropdownModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
    // NgbModal
  ],
  declarations: [MastersComponent,ExpenseMastersComponent]
})
export class MastersModule { }
