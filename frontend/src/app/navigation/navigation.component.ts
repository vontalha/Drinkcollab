import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import {StorepageComponent} from "../storepage/storepage.component";
import {RouterLink, RouterOutlet} from "@angular/router";
import {AuthService} from "../services/auth.service";
import axios from "axios";
import {Observable} from "rxjs";
import {MatMenu, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {ShopingCartComponent} from "../shoping-cart/shoping-cart.component";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    StorepageComponent,
    RouterLink,
    RouterOutlet,
    NgIf,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    ShopingCartComponent,
  ]
})
export class NavigationComponent implements OnInit{
  // @ts-ignore
  isAuthenticated$: Observable<boolean>;
  // @ts-ignore
  isAuthorized$: Observable<boolean>;

  sidebarOpen: boolean = false;

  constructor(private auth: AuthService, private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.isAuthenticated$ = this.auth.isAuthenticated$();
    this.isAuthorized$ = this.auth.isAuthorized$();

    this.isAuthorized$.subscribe(()=>{
      this.cd.detectChanges();
    })
    // Manuelle Change Detection anstoßen
    this.isAuthenticated$.subscribe((isAuthenticated) => {
      this.cd.detectChanges();
      setTimeout(() => this.sidebarOpen = !this.sidebarOpen && isAuthenticated, 100);
    });
  }
  logout(){
    this.auth.logout();
  }
  neueUser(){
    axios.get('http://localhost:3000/admin/requests', { withCredentials: true }).then((response)=>{
      console.log(response.data);
    })
  }
  getUser(){
    axios.get('http://localhost:3000/admin/products', { withCredentials: true }).then((response)=>{
      console.log(response.data.data.Product.toString());
    });
  }
}
