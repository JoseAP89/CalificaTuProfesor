import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RosterComponent } from './roster.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RosterComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: RosterComponent }
    ])
  ]
})
export class RosterComponentModule {}