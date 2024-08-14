import { Injectable } from '@angular/core';
import {from, Observable} from 'rxjs';
import axios from 'axios';
import {response} from "express";

//import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})


export class AuthService {
  apiUrl: string = 'http://localhost:3000';

  constructor() { }

  requestAccount(email: string){
    axios.post('https://localhost:3000/account-request',{email: email},{ withCredentials: true }).then((response)=>{
      console.log(response.status);
    });
  }

  login(username: string, password: string): Observable<boolean> {
    return from(axios.post(this.apiUrl + '/api/User/login', { username, password }, {withCredentials:true}).then((response)=>{
      return !!(response.data.userId && response.data.role);
    }));
    //return this.http.post(this.apiUrl + '/api/User/login', { username, password }, {withCredentials:true});
  }

  logout(){
    axios.post(this.apiUrl + '/auth/logout',{},{withCredentials: true}).then((response)=>{
      console.log(response.status);
    });

  }

  public async isAuthenticated() : Promise<boolean> {
    return await axios.get(this.apiUrl + '/auth/check', {withCredentials: true}).then((response) => {
      return !!(response.data.userId && response.data.role);
    });

    //const token = localStorage.getItem('authToken');
    //const helper = new JwtHelperService();
    //const isExpired = helper.isTokenExpired(token);
    //return !isExpired;
    //return false;
  }
}
