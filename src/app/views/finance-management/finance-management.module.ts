import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FinanceManagementComponent } from './finance-management.component';
import { IncomeManagementComponent } from './income-management/income-management.component';
import { CommonModule } from '@angular/common';
import { ExpenseManagementComponent } from './expense-management/expense-management.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: '',
    component: FinanceManagementComponent,
    data: {
      title: 'finance'
    }
  }
];

@NgModule({
  declarations: [FinanceManagementComponent, IncomeManagementComponent, ExpenseManagementComponent],
  imports: [RouterModule.forChild(routes), CommonModule, FormsModule, ReactiveFormsModule, NgbModule],
  exports: [RouterModule]
})
export class FinanceManagementModule {
  name = new FormControl('');
}
