import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import { AuthService } from "../services/auth.service";
import {from, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate{
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot) {
    let activate = await this.authService.isAuthenticated()
    if (activate) {
      //this.router.navigate(['/','home']);
      return true;
    } else {
      this.router.navigate(['/','login']);
      return false;
    }
  }

  private checkAuthentication(): Observable<boolean> {
    return from(this.authService.isAuthenticated());
  }
}
