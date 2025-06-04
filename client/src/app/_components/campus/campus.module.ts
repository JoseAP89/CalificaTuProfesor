import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CampusComponent } from './campus.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CampusComponent],
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: CampusComponent }
    ])
  ]
})
export class CampusComponentModule {}