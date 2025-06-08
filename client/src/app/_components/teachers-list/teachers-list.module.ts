
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TeachersListComponent } from './teachers-list.component';

@NgModule({
  declarations: [TeachersListComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: TeachersListComponent }
    ])
  ]
})
export class TeachersListModule {}