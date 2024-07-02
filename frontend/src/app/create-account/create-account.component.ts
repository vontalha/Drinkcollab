import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {NgIf} from "@angular/common";
import {HttpClient} from "@angular/common/http";

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
        ReactiveFormsModule
    ],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css'
})
export class CreateAccountComponent {

  constructor(private http: HttpClient) { }

  form: FormGroup = new FormGroup({
    email: new FormControl(''),
    name: new FormControl(''),
    firstname: new FormControl(''),
    password: new FormControl(''),
    password1: new FormControl(''),
  });

  submit() {
    if (this.form.valid) {
      this.submitEM.emit(this.form.value);
    }
  }
  createAccount(uuid: string): void {
    if (this.form.valid) {
      this.http.post('https://localhost:3000/requests/approve/', {credentials: {     email: this.form.get('email')?.value,     password: this.form.get('password1')?.value,     firstName: this.form.get('firstname')?.value,     lastName: this.form.get('name')?.value }})
        .subscribe(response => {
          console.log(`UUID ${uuid} approved`);
        });
    }
  }
  // @ts-ignore
  @Input() error: string | null;

  @Output() submitEM = new EventEmitter();
}
