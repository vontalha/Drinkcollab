import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButtonModule} from '@angular/material/button';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-request-account',
  standalone: true,
    imports: [
        FormsModule,
        MatCard,
        MatCardContent,
        MatCardTitle,
        MatFormField,
        MatInput,
        MatButtonModule,
        ReactiveFormsModule
    ],
  templateUrl: './request-account.component.html',
  styleUrl: './request-account.component.css',
  host: {ngSkipHydration: 'true'}
})
export class RequestAccountComponent {
  // @ts-ignore

  constructor(private http: HttpClient) { }

    form: FormGroup = new FormGroup({
        email: new FormControl('',Validators.required),
      });

  requestAccount() {
    if (this.form.valid) {
      // @ts-ignore
      let email = this.form.get('email').value;
      console.log("email:", email);
      // @ts-ignore
      this.http.post('https://localhost:3000/account-request', {email: email});
    }
  }
  // @ts-ignore
  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();
}
