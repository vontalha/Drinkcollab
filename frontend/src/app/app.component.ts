import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {NavigationComponent} from "./navigation/navigation.component";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {MatIcon} from "@angular/material/icon";
import {MatToolbar} from "@angular/material/toolbar";
import {MatIconButton} from "@angular/material/button";
import {MatListItem, MatNavList} from "@angular/material/list";
import {AuthService} from "./services/auth.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavigationComponent, RouterLink, MatSidenavContent, MatSidenav, MatSidenavContainer, MatIcon, MatToolbar, MatIconButton, MatNavList, MatListItem],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'Drinkcollab';
  // @ts-ignore
  isAuthenticated$: Observable<boolean>;

  constructor(private auth: AuthService, private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.isAuthenticated$ = this.auth.isAuthenticated$();
    this.isAuthenticated$.subscribe(() => {
      this.cd.detectChanges();
    });
    }

  protected readonly console = console;
}
