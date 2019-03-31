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
import { } from '../studentview/studentview.component';

import { StudentComponent } from './student.component';
import { StudentRoutingModule } from './student-routing.module';
import { StudentviewComponent } from '../studentview/studentview.component';



@NgModule({
    imports: [
        StudentRoutingModule,
        ChartsModule,
        BsDropdownModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [StudentComponent, StudentviewComponent]
})
export class StudentModule { }
