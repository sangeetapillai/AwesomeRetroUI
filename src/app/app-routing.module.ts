import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from './app.component';
import {RetrocardComponent} from './retrocard/retrocard.component';
import {RetroComponent} from './retro/retro.component';
import {CreateComponent} from './create/create.component';

const routes: Routes = [
  {path: 'retro/:id', component: RetroComponent },
  {path: '', component: CreateComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
