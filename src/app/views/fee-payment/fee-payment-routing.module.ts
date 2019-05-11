import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormControl } from '@angular/forms';
import { FeePaymentComponent } from './fee-payment.component';

const routes: Routes = [
  {
    path: '',
    component: FeePaymentComponent,
    data: {
      title: 'Payment'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeePaymentRoutingModule {
  name = new FormControl('');
}
