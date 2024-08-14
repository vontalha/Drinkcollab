import { Injectable } from "@angular/core";
import {CanActivate, CanActivateFn, Router} from "@angular/router";
import { AuthService } from "../services/auth.service";
import {from, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate{
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    let activate;
    this.authService.isAuthenticated().then((result)=>{
      activate = result;
    });
    if (activate) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  private checkAuthentication(): Observable<boolean> {
    return from(this.authService.isAuthenticated());
  }
}
