import { Routes } from '@angular/router';
import {CreateAccountComponent} from "./create-account/create-account.component";
import {StorepageComponent} from "./storepage/storepage.component";
import {LoginformComponent} from "./loginform/loginform.component";
import {RequestAccountComponent} from "./request-account/request-account.component";

export const routes: Routes = [
  {path:'login',component: LoginformComponent},
  {path:'create-account',component: CreateAccountComponent},
  {path:'request-account',component: RequestAccountComponent},
  {path:'home',component: StorepageComponent},
];
