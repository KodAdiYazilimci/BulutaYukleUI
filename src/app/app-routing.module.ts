import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './components/index/component.index';
import { LoginComponent } from './components/login/component.login';

const routes: Routes = [
  { path: "", redirectTo: "Anasayfa", pathMatch: "full" },
  { path: "Anasayfa", component: IndexComponent },
  { path: "OturumAc", component: LoginComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
