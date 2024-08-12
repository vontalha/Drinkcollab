import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {NavigationComponent} from "./navigation/navigation.component";
import {LoginformComponent} from "./loginform/loginform.component";
import {RequestAccountComponent} from "./request-account/request-account.component";
import {CreateAccountComponent} from "./create-account/create-account.component";
import {StorepageComponent} from "./storepage/storepage.component";
import {UserListComponent} from "./user-list/user-list.component";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatToolbar} from "@angular/material/toolbar";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, LoginformComponent, RequestAccountComponent, CreateAccountComponent, StorepageComponent, UserListComponent, MatTabGroup, MatTab, MatToolbar, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Drinkcollab';

  constructor(router:Router) {
    // router.navigate(['/login'], {
    //   skipLocationChange: true,
    // });
  }
}
