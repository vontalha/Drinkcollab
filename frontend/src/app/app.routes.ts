import { Routes } from '@angular/router';
import {CreateAccountComponent} from "./create-account/create-account.component";
import {StorepageComponent} from "./storepage/storepage.component";
import {LoginformComponent} from "./loginform/loginform.component";
import {RequestAccountComponent} from "./request-account/request-account.component";
import {UserListComponent} from "./user-list/user-list.component";
import {AuthGuard} from "./guards/auth.guard";
import {NotAuthenticatedGuard} from "./guards/not-authenticated.guard";
import {ProductListComponent} from "./product-list/product-list.component";
import {NewUserListComponent} from "./new-user-list/new-user-list.component";

export const routes: Routes = [
  {path:'login',component: LoginformComponent, canActivate:[NotAuthenticatedGuard]},
  {path:'account-request/approved',component: CreateAccountComponent},
  {path:'request-account',component: RequestAccountComponent, canActivate:[NotAuthenticatedGuard]},
  {path:'home',component: ProductListComponent, canActivate:[AuthGuard]},
  {path:'admin', component: UserListComponent, canActivate:[AuthGuard]},
  {path:'new-user', component: NewUserListComponent, canActivate:[AuthGuard]},
  {path:'', redirectTo:'/login', pathMatch:'full'}
];
//{path:'home',component: StorepageComponent, canActivate:[AuthGuard]},
