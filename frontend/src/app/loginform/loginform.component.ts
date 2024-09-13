import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {MatButton} from "@angular/material/button";
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import {AuthService} from "../services/auth.service";
import {CartService} from "../services/CartService";

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
  @Output() onLogin = new EventEmitter<void>();

  constructor(
    private fB: FormBuilder,
    private router: Router,
    private auth: AuthService,
    private cart: CartService
    ) {
  }
  form = this.fB.group({
    email: ['admin@example.com', [Validators.required, Validators.email]],
    password: ['ExamplePassword', Validators.required]
  });

  async login() {
      if (this.form.valid) {
        // @ts-ignore
        let email = this.form.get('email')!.value.toString();
        // @ts-ignore
        //{"email": "admin@example.com" , "password": "ExamplePassword"}
        let password  = this.form.get('password')!.value.toString();
        let success = await this.auth.login(email, password)
        if (success) {
          this.onLogin.emit();
          await this.router.navigate(['/', 'home']).then(()=>{
            this.cart.setNewItemStatus(true)});
        }else{

        }

        // axios.post('http://localhost:3000/auth/login',{'email': email , 'password': password},{ withCredentials: true }).then((response)=>{
        //   console.log(response.data);
        //    this.router.navigate(['/', 'home']);
        //  });
    }
  }
  // @ts-ignore
  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();
}
