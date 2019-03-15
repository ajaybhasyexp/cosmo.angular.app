import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms'
import { BranchComponent } from './branch.component';

const routes: Routes = [
  {
    path: '',
    component: BranchComponent,
    data: {
      title: 'Masters'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchRoutingModule {
  name = new FormControl('');
}
