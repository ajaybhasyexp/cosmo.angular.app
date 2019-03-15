import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';

import { BranchComponent } from './branch.component';
import { BranchRoutingModule } from './branch-routing.module';
import { BatchComponent } from '../batch/batch.component';

@NgModule({
  imports: [
    BranchRoutingModule,
    ChartsModule,
    BsDropdownModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [BranchComponent, BatchComponent]
})
export class BranchModule {}
