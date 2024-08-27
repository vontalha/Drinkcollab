import {Component, OnInit} from '@angular/core';
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatIcon} from "@angular/material/icon";
import axios from 'axios';
import {MatButton} from "@angular/material/button";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatIcon,
    MatButton,
    MatFormField,
    FormsModule,
    MatError,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{
  //todo
  form: FormGroup = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required, Validators.minLength(2),Validators.maxLength(255), Validators.pattern(/^[a-zA-Z]+$/)]),
    firstname: new FormControl('',[Validators.required, Validators.minLength(2),Validators.maxLength(255), Validators.pattern(/^[a-zA-Z]+$/)]),
    password: new FormControl('',[Validators.required, Validators.minLength(8), Validators.maxLength(255),Validators.pattern(/[A-Z]/), Validators.pattern(/[\W_]/), Validators.pattern(/[0-9]/)]),
    password1: new FormControl('', Validators.required),
  });
  ngOnInit(): void {
    this.getMe();
  }
  constructor() {
  }

  getMe(){
    axios.get('http://localhost:3000/', {withCredentials:true}).then((response)=>{

    });
  }


  editProfile(){
    axios.post('http://localhost:3000/', {},{withCredentials:true}).then((response)=>{

    })
  }
}
