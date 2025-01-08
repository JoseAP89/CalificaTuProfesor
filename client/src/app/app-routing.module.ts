import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './_components/home/home.component';
import { AddItemsComponent } from './_components/add-items/add-items.component';
import { RosterComponent } from './_components/roster/roster.component';
import { CampusComponent } from './_components/campus/campus.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'agregar', component: AddItemsComponent},
  {path: 'maestro/:recordId', component: RosterComponent},
  {path: 'campus/:recordId', component: CampusComponent},
/*
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {path: 'usuarios-sistema', component: UsuariosSistemaComponent},
      {path: 'ciclos', component: CiclosComponent},
    ]
  },
  {path: '**', component: InicioComponent, pathMatch: 'full'} */
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
