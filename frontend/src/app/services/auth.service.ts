import { Injectable } from '@angular/core';
import axios from 'axios';

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
  }

  logout(){
    axios.post(this.apiUrl + '/auth/logout',{},{withCredentials: true}).then((response)=>{
      console.log(response.status);
    });
  }


  public async isAuthenticated() : Promise<boolean> {
    return await axios.get(this.apiUrl + '/user/me', {withCredentials: true})
      .then((response) => {
      console.log(response.data.id && response.data.role);
      return true;

    })
      .catch(e => {
        return false
      })
  }
}
