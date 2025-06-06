import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './_components/home/home.component';
import { AddItemsComponent } from './_components/add-items/add-items.component';
import { RosterComponent } from './_components/roster/roster.component';
import { CampusComponent } from './_components/campus/campus.component';
import { AboutUsComponent } from './_components/about-us/about-us.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./_components/home/home.module').then(m => m.HomeComponentModule)
  },
  {
    path: 'agregar',
    loadChildren: () => import('./_components/add-items/add-items.module').then(m => m.AddItemsComponentModule)
  },
  {
    path: 'maestro/:recordId',
    loadChildren: () => import('./_components/roster/roster.module').then(m => m.RosterComponentModule)
  },
  {
    path: 'campus/:recordId',
    loadChildren: () => import('./_components/campus/campus.module').then(m => m.CampusComponentModule)
  },
  {
    path: 'acerca-de-nosotros',
    loadChildren: () => import('./_components/about-us/about-us.module').then(m => m.AboutUsComponentModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
