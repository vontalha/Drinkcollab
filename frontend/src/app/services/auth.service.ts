import { Injectable } from '@angular/core';
import {from, Observable} from 'rxjs';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

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

  login(email: string, password: string): Promise<boolean> {
    return axios.post(this.apiUrl + '/auth/login', { email, password }, {withCredentials:true}).then((response)=>{
      console.log(!!(response.data.userId && response.data.role));
      return !!(response.data.userId && response.data.role);
    })
    //return this.http.post(this.apiUrl + '/api/User/login', { username, password }, {withCredentials:true});
  }

  logout(){
    axios.post(this.apiUrl + '/auth/logout',{},{withCredentials: true}).then((response)=>{
      console.log(response.status);
    });
  }




  public async isAuthenticated() : Promise<boolean> {

    return await axios.get(this.apiUrl + '/user/me', {withCredentials: true}).then((response) => {
      if(response.status==401){
        console.log("status"+response.status);
        return false
      }
      console.log(response.data.id && response.data.role);
      return true;

      //return !!(response.data.id && response.data.role);
    });

    //const token = localStorage.getItem('authToken');
    //const helper = new JwtHelperService();
    //const isExpired = helper.isTokenExpired(token);
    //return !isExpired;
    //return false;
  }
}