import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormControl } from '@angular/forms';
import { StudentComponent } from './student.component';

const routes: Routes = [
  {
    path: '',
    component: StudentComponent,
    data: {
      title: 'Student'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule {
  name = new FormControl('');
}
