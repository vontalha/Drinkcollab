import { Routes } from '@angular/router';
import {CreateAccountComponent} from "./create-account/create-account.component";
import {StorepageComponent} from "./storepage/storepage.component";
import {LoginformComponent} from "./loginform/loginform.component";
import {RequestAccountComponent} from "./request-account/request-account.component";
import {UserListComponent} from "./user-list/user-list.component";
import {AuthGuard} from "./guards/auth.guard";
import {NotAuthenticatedGuard} from "./guards/not-authenticated.guard";

export const routes: Routes = [
  {path:'login',component: LoginformComponent, canActivate:[NotAuthenticatedGuard]},
  {path:'account-request/approved',component: CreateAccountComponent},
  {path:'request-account',component: RequestAccountComponent, canActivate:[NotAuthenticatedGuard]},
  {path:'home',component: StorepageComponent, canActivate:[AuthGuard]},
  {path:'admin', component: UserListComponent},
  {path:'', redirectTo:'/login', pathMatch:'full'}
];
