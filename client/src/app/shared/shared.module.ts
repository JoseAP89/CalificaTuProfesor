import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { AlertMessageComponent } from './alert-message/alert-message.component';
import { TopRankingListComponent } from './top-ranking-list/top-ranking-list.component';
import { StarComponent } from './star/star.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {MatCheckboxModule} from '@angular/material/checkbox';


const materialModules = [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatSnackBarModule,
    MatSliderModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatBadgeModule,
    MatCheckboxModule
];

@NgModule({
  declarations: [AlertMessageComponent, TopRankingListComponent, StarComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ...materialModules
  ],
  exports: [
    ...materialModules, AlertMessageComponent, TopRankingListComponent, StarComponent,
    FormsModule,
    RouterModule,
  ]
})
export class SharedModule { }
