import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MastersComponent } from './masters.component';

const routes: Routes = [
  {
    path: '',
    component: MastersComponent,
    data: {
      title: 'Masters'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MastersRoutingModule {
  name = new FormControl('');
}
