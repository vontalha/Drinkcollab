import { Injectable } from '@angular/core';
import axios from 'axios';
import {Router} from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  apiUrl: string = 'http://localhost:3000';
  private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isAuthorizedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); //true falls admin sonst false

  constructor(private router: Router) {
    this.checkAuthenticationStatus();
  }

  private async checkAuthenticationStatus() {
    const isAuthenticated = await this.isAuthenticated();
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  isAuthorized$(): Observable<boolean>{
    return this.isAuthorizedSubject.asObservable();
  }

  isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  requestAccount(email: string){
    axios.post(this.apiUrl + '/account-request',{email: email},{withCredentials: true}).then((response)=>{
      console.log(response.status);
    });
  }

  async login(email: string, password: string): Promise<boolean> {
    return axios.post(this.apiUrl + '/auth/login', { email, password }, {withCredentials:true}).then((response)=>{
      console.log(!!(response.data.userId && response.data.role));
      localStorage.setItem("accessToken",JSON.stringify({userId: response.data.userId,role: response.data.role, TokenExpiringAt: Date.now() + 1000 * 3600 * 0.5})); //30 Minuten valid
      this.isAuthenticatedSubject.next(true);
      if(response.data.role == "ADMIN"){
        this.isAuthorizedSubject.next(true);
      }
      return !!(response.data.userId && response.data.role);
    }).catch((error)=>{
      console.log(error.status);
      return false;
    })
  }

  logout(){
    axios.post(this.apiUrl + '/auth/logout',{},{withCredentials: true}).then((response)=>{
      console.log(response.status);
    });
    localStorage.clear();
    this.isAuthenticatedSubject.next(false);
    this.isAuthorizedSubject.next(false)
    this.router.navigate(['/'+'login']);
  }

  public async isAuthenticated() : Promise<boolean> {
    return await axios.get(this.apiUrl + '/user/me', {withCredentials: true})
      .then((response) => {
        const item = JSON.parse(localStorage.getItem("accessToken") || "null");
        if(item){
          localStorage.removeItem("accessToken");
          localStorage.setItem("accessToken",JSON.stringify({userId: response.data.userId,role: response.data.role, TokenExpiringAt: Date.now() + 1000 * 3600 * 0.5}));
        }
        if(response.data.role == "ADMIN"){
          this.isAuthorizedSubject.next(true);
        }
        console.log(response.data.id && response.data.role);
      return true;
    })
      .catch(e => {
        //localStorage.clear();
        return false
      })
  }
}
