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

import { BatchComponent } from './batch.component';

@NgModule({
  imports: [
    ChartsModule,
    BsDropdownModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [BatchComponent]
})
export class BranchModule {}
