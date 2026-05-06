import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CobroPage } from './cobro.page';

const routes: Routes = [
  {
    path: '',
    component: CobroPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CobroPageRoutingModule {}
