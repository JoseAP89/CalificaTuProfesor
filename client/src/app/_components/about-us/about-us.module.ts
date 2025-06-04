import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AboutUsComponent } from './about-us.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AboutUsComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: AboutUsComponent }
    ])
  ]
})
export class AboutUsComponentModule {}