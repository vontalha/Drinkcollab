import { Routes } from '@angular/router';
import {CreateAccountComponent} from "./create-account/create-account.component";
import {StorepageComponent} from "./storepage/storepage.component";
import {LoginformComponent} from "./loginform/loginform.component";
import {RequestAccountComponent} from "./request-account/request-account.component";
import {UserListComponent} from "./user-list/user-list.component";

export const routes: Routes = [
  {path:'login',component: LoginformComponent, canActivate:[]},
  {path:'account-request/approve',component: CreateAccountComponent},
  {path:'request-account',component: RequestAccountComponent},
  {path:'home',component: StorepageComponent},
  {path:'admin', component: UserListComponent},
  {path:'', redirectTo:'/login', pathMatch:'full'}
];
