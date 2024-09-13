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
import {ProductVerwaltungComponent} from "./product-verwaltung/product-verwaltung.component";
import {DrinksComponent} from "./drinks/drinks.component";
import {SnacksComponent} from "./snacks/snacks.component";
import {InvoiceComponent} from "./invoice/invoice.component";
import {ProfileComponent} from "./profile/profile.component";

export const routes: Routes = [
  {path:'login',component: LoginformComponent, canActivate:[NotAuthenticatedGuard]},
  {path:'account-request/approved',component: CreateAccountComponent},
  {path:'request-account',component: RequestAccountComponent, canActivate:[NotAuthenticatedGuard]},
  {path:'home',component: ProductListComponent, canActivate:[AuthGuard]},
  {path:'drinks',component: DrinksComponent, canActivate:[AuthGuard]},
  {path:'snacks',component: SnacksComponent, canActivate:[AuthGuard]},
  {path:'admin', component: UserListComponent, canActivate:[AuthGuard]},
  {path:'new-user', component: NewUserListComponent, canActivate:[AuthGuard]},
  {path:'produkt-verwaltung', component: ProductVerwaltungComponent, canActivate:[AuthGuard]},
  {path:'payment/invoice',component: InvoiceComponent, canActivate:[AuthGuard]},
  {path:'profile',component: ProfileComponent, canActivate:[AuthGuard]},
  {path:'', redirectTo:'/login', pathMatch:'full'}
];
//{path:'home',component: StorepageComponent, canActivate:[AuthGuard]},
