import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButtonModule} from '@angular/material/button';
import {HttpClient} from "@angular/common/http";
import axios from "axios";
import {response} from "express";
import {NgIf} from "@angular/common";
import {AuthService} from "../services/auth.service";

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
    ReactiveFormsModule,
    MatError,
    NgIf,
    MatCardHeader
  ],
  templateUrl: './request-account.component.html',
  styleUrl: './request-account.component.css',
  host: {ngSkipHydration: 'true'}
})
export class RequestAccountComponent {
  // @ts-ignore

  constructor(private fB: FormBuilder, private auth: AuthService) { }

  form = this.fB.group({
    email: ['', [Validators.required, Validators.email]]
  });

  // form: FormGroup = new FormGroup({
  //   email: new FormControl('',[Validators.required, Validators.email]),
  // });

  requestAccount() {
    if (this.form.valid) {
      this.auth.requestAccount(this.form.get('email')!.value!.toString());
      // @ts-ignore
      // axios.post('https://localhost:3000/account-request',{email: email},{ withCredentials: true }).then((response)=>{
      //   console.log(response.status);
      // });
    }
  }
  // @ts-ignore
  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();
}
