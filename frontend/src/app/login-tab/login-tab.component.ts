import { Component } from '@angular/core';
import {LoginformComponent} from "../loginform/loginform.component";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {RequestAccountComponent} from "../request-account/request-account.component";

@Component({
  selector: 'app-login-tab',
  standalone: true,
    imports: [
        LoginformComponent,
        MatTab,
        MatTabGroup,
        RequestAccountComponent
    ],
  templateUrl: './login-tab.component.html',
  styleUrl: './login-tab.component.css'
})
export class LoginTabComponent {

}
