import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './components/index/component.index';

const routes: Routes = [
  { path: "", redirectTo: "Anasayfa", pathMatch: "full" },
  { path: "Anasayfa", component: IndexComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
