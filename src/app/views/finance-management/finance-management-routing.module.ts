import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormControl } from '@angular/forms';
import { FinanceManagementComponent } from './finance-management.component';

const routes: Routes = [
  {
    path: '',
    component: FinanceManagementComponent,
    data: {
      title: 'Payment'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceManagementRoutingModule {
  name = new FormControl('');
}
