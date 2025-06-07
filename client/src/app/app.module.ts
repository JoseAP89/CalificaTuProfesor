import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {MatRadioModule} from '@angular/material/radio';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { NavbarComponent } from './_components/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import { AddTeacherComponent } from './_components/dialogs/add-teacher/add-teacher.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { AddUniversityComponent } from './_components/dialogs/add-university/add-university.component';
import { AddCampusComponent } from './_components/dialogs/add-campus/add-campus.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { RateComponent } from './_components/dialogs/rate/rate.component';
import {MatSliderModule} from '@angular/material/slider';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatBadgeModule} from '@angular/material/badge';
import { EditCommentComponent } from './_components/dialogs/edit-comment/edit-comment.component';
import { CancelAcceptComponent } from './_components/dialogs/cancel-accept/cancel-accept.component';
import { AlertMessageComponent } from './shared/alert-message/alert-message.component';
import { FooterComponent } from './_components/footer/footer.component';
import { HttpErrorInterceptor } from './_services/http-error.interceptor';
import { SharedModule } from './shared/shared.module';
import { AddNotificationComponent } from './_components/dialogs/add-notification/add-notification.component';
import { registerLocaleData } from '@angular/common';
import localeEsMX from '@angular/common/locales/es-MX';

// Register the locale data
registerLocaleData(localeEsMX, 'es-MX');
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AddTeacherComponent,
    AddUniversityComponent,
    AddCampusComponent,
    RateComponent,
    EditCommentComponent,
    CancelAcceptComponent,
    FooterComponent,
    AddNotificationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
