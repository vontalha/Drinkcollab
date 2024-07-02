import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {HttpClient} from '@angular/common/http';

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
    MatButton
  ],
  templateUrl: './loginform.component.html',
  styleUrl: './loginform.component.css',
  host: {ngSkipHydration: 'true'}
})
export class LoginformComponent {

  constructor(private http: HttpClient) { }

  form: FormGroup = new FormGroup({
    email: new FormControl('',Validators.required),
    password: new FormControl('',Validators.required),
  });

  login() {
      if (this.form.valid) {
        // @ts-ignore
        let email = this.form.get('email').value;
        // @ts-ignore
        //{"email": "admin@email.com" , "password": "ExamplePassword"}
        let password  = this.form.get('password');
        this.http.post('https://localhost:3000/auth/login',  {email: email , password: password})
          .subscribe(response => {
            console.log("login");
          });
    }
  }
  // @ts-ignore
  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();
}
