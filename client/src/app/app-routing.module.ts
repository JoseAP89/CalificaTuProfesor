import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './_components/home/home.component';
import { AddItemsComponent } from './_components/add-items/add-items.component';
import { RosterComponent } from './_components/roster/roster.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'add-items', component: AddItemsComponent},
  {path: 'teacher/:rosterId', component: RosterComponent},
/*
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      {path: 'usuarios-sistema', component: UsuariosSistemaComponent},
      {path: 'avanze-presupuesto', component: AvanzePresupuestoComponent},
      {path: 'catalogo-presupuesto', component: CatalogoPresupuestalComponent},
      {path: 'captura-presupuesto', component: CapturaPresupuestoComponent},
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
