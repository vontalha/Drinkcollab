import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardHeader, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import axios from "axios";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    FormsModule,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatFormField,
    MatInput,
    NgIf,
    MatButtonModule,
    ReactiveFormsModule,
    MatError,
    MatLabel,
    MatHint,
    MatIcon,
    MatCardHeader
  ],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css'
})
export class CreateAccountComponent implements OnInit{
  constructor(private route: ActivatedRoute,private router: Router) {}
  token ='';
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
    axios.get(`http://localhost:3000/account-request/approved?token=${this.token}`, {withCredentials:true});
  }

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2),Validators.maxLength(255), Validators.pattern(/^[a-zA-Z]+$/)]),
    firstname: new FormControl('',[Validators.required, Validators.minLength(2),Validators.maxLength(255), Validators.pattern(/^[a-zA-Z]+$/)]),
    password: new FormControl('',[Validators.required, Validators.minLength(8), Validators.maxLength(255),Validators.pattern(/[A-Z]/), Validators.pattern(/[\W_]/), Validators.pattern(/[0-9]/)]),
    password1: new FormControl('', Validators.required),
  });

  createAccount(): void {
    if (this.form.valid) {
      axios.post('http://localhost:3000/auth/signup', {
        firstName: this.form.get('firstname')?.value,
        lastName: this.form.get('name')?.value,
        password: this.form.get('password1')?.value,
      },{withCredentials:true, headers:{'Content-Type': 'application/json',}}).then((response)=>{
        console.log(response.status);
        console.log(response.data);
        if(response.status==200){
          this.router.navigate(['/', 'home']);
        }

      }).catch((error) => {
        console.error('Signup error:', error.response?.data || error.message);
      });
    }
  }
  // @ts-ignore
  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();
}
