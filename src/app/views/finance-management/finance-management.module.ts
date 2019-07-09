import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FinanceManagementComponent } from './finance-management.component';
import { IncomeManagementComponent } from './income-management/income-management.component';
import { CommonModule } from '@angular/common';
import { ExpenseManagementComponent } from './expense-management/expense-management.component';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../../shared/ngb-date-customparser';

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
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ],
  exports: [RouterModule]
})
export class FinanceManagementModule {
  name = new FormControl('');
}
