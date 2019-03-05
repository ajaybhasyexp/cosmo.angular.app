import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { MastersComponent } from './masters.component';
import { MastersRoutingModule } from './masters-routing.module';

@NgModule({
  imports: [
    MastersRoutingModule,
    ChartsModule,
    BsDropdownModule,
    CommonModule,
    FormsModule,
    // NgbModal
  ],
  declarations: [MastersComponent]
})
export class MastersModule { }
