import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminCalculatorComponent } from './admin-calculator/admin-calculator.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'im-ceo-bitch', component: AdminCalculatorComponent },
  { path: 'calculator', component: CalculatorComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 

  
}
