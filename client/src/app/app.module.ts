import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatRadioModule} from '@angular/material/radio';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { HomeComponent } from './_components/home/home.component';
import { NavbarComponent } from './_components/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AddItemsComponent } from './_components/add-items/add-items.component';
import {MatDialogModule} from '@angular/material/dialog';
import { AddTeacherComponent } from './_components/dialogs/add-teacher/add-teacher.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AddUniversityComponent } from './_components/dialogs/add-university/add-university.component';
import { AddCampusComponent } from './_components/dialogs/add-campus/add-campus.component';
import { RosterComponent } from './_components/roster/roster.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { RateComponent } from './_components/dialogs/rate/rate.component';
import {MatSliderModule} from '@angular/material/slider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatBadgeModule} from '@angular/material/badge';
import { EditCommentComponent } from './_components/dialogs/edit-comment/edit-comment.component';
import { CancelAcceptComponent } from './_components/dialogs/cancel-accept/cancel-accept.component';
import { CampusComponent } from './_components/campus/campus.component';
import { TopRankingListComponent } from './_shared/top-ranking-list/top-ranking-list.component';
import { AlertMessageComponent } from './_shared/alert-message/alert-message.component';
import { StarComponent } from './_shared/star/star.component';
import { AboutUsComponent } from './_components/about-us/about-us.component';
import { FooterComponent } from './_components/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    AddItemsComponent,
    AddTeacherComponent,
    AddUniversityComponent,
    AddCampusComponent,
    RosterComponent,
    RateComponent,
    EditCommentComponent,
    CancelAcceptComponent,
    CampusComponent,
    TopRankingListComponent,
    AlertMessageComponent,
    StarComponent,
    AboutUsComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    HttpClientModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatSnackBarModule,
    MatSliderModule,
    MatExpansionModule,
    MatPaginatorModule,
    MatBadgeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
