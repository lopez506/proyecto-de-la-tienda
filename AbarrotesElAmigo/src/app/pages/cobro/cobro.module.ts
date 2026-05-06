import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CobroPageRoutingModule } from './cobro-routing.module';
import { CobroPage } from './cobro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CobroPageRoutingModule,
    CobroPage
  ]
})
export class CobroPageModule {}