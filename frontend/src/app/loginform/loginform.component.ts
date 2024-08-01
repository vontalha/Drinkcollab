import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {CommonModule} from "@angular/common";
import {MatButton} from "@angular/material/button";
import {HttpClient} from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import axios from 'axios';
import { Router } from '@angular/router';
import {MatTableDataSource} from "@angular/material/table";

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

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    ) { }

  form: FormGroup = new FormGroup({
    email: new FormControl('',Validators.required),
    password: new FormControl('',Validators.required),
  });
  // loginForm = this.formBuilder.group({
  //   email: '',
  //   password: ''
  // });

  login() {
      if (this.form.valid) {
        // @ts-ignore
        let email = this.form.get('email')?.value.toString();
        // @ts-ignore
        //{"email": "admin@email.com" , "password": "ExamplePassword"}
        let password  = this.form.get('password')?.value.toString();

        axios.post('http://localhost:3000/auth/login',{'email': email , 'password': password},{ withCredentials: true }).then((response)=>{
          console.log(response.data);
          //console.log()
          console.log("login");
          // if(response.status==200){
          //   this.router.navigate(['/', 'home']);
          // }
          this.table();
          //console.log(withCredentials)
        });
        // this.http.post('http://localhost:3000/auth/login',  {'email': email , 'password': password})
        // //this.http.post('https://localhost:3000/auth/login',  this.loginForm.value)
        //   .subscribe(response => {
        //     console.log("login");
        //   });
    }
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
