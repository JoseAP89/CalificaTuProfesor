import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddItemsComponent } from './add-items.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AddItemsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: AddItemsComponent }
    ])
  ]
})
export class AddItemsComponentModule {}