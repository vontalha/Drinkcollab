import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {MatButton} from "@angular/material/button";
import { FormBuilder } from '@angular/forms';
import axios from 'axios';
import { Router } from '@angular/router';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-loginform',
  standalone: true,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    ReactiveFormsModule,
    MatLabel,
    MatError,
    MatInputModule,
    CommonModule,
    MatButton,
    MatCardHeader
  ],
  templateUrl: './loginform.component.html',
  styleUrl: './loginform.component.css',
  host: {ngSkipHydration: 'true'}
})
export class LoginformComponent {


  constructor(
    private fB: FormBuilder,
    private router: Router,
    private auth: AuthService
    ) {
  }
  form = this.fB.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  // form: FormGroup = new FormGroup({
  //   email: new FormControl('',[Validators.required, Validators.email]),
  //   password: new FormControl('',Validators.required),
  // });

  login() {
      if (this.form.valid) {
        // @ts-ignore
        let email = this.form.get('email')!.value.toString();
        // @ts-ignore
        //{"email": "admin@email.com" , "password": "ExamplePassword"}
        let password  = this.form.get('password')!.value.toString();
        if(this.auth.login(email , password)){
          this.router.navigate(['/', 'home']);
        }
        axios.post('http://localhost:3000/auth/login',{'email': email , 'password': password},{ withCredentials: true }).then((response)=>{
          console.log(response.data);
          console.log("login");
          //this.table();
          this.getProducts();
        });
    }
  }
  getProducts(){
    axios.get('http://localhost:3000/products/all?sortBy=price&sortOrder=asc', { withCredentials: true }).then((response)=>{
      console.log(response.data.toString());
      this.router.navigate(['/', 'home']);
    });
  }
  table(){
    axios.get('http://localhost:3000/admin/requests', { withCredentials: true }).then((response)=>{
      console.log(response.data.toString());
      this.router.navigate(['/', 'home']);
    });
  }

  // @ts-ignore
  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();
}
