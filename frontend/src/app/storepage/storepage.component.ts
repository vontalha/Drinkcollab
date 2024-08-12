import {Component, inject, OnInit} from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import {AsyncPipe, NgFor} from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatFormField, MatFormFieldControl, MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatOption, MatSelect} from "@angular/material/select";
import {FormsModule} from "@angular/forms";
import {ShopItemComponent} from "../shop-item/shop-item.component";
import {MatInputModule} from "@angular/material/input";

interface Filter {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-storepage',
  templateUrl: './storepage.component.html',
  styleUrl: './storepage.component.css',
  standalone: true,
  imports: [
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormField,
    MatSelect,
    MatOption,
    FormsModule,
    MatLabel,
    ShopItemComponent,
    MatFormFieldModule,
    MatInputModule,
    NgFor
  ]
})
export class StorepageComponent implements OnInit{

  ngOnInit() {

  }

  filters: Filter[] = [
    {value: '0', viewValue: 'Absteigend'},
    {value: '1', viewValue: 'Aufsteigend'},
    {value: '2', viewValue: 'XYZ'},
  ];

  products: any[] = [
    { name: 'Shiba Inu', quantity: 10, image: 'https://material.angular.io/assets/img/examples/shiba2.jpg' },
    { name: 'Product 2', quantity: 20, image: 'product2.jpg' },
    { name: 'Product 3', quantity: 30, image: 'product3.jpg' }
  ];
  searchTerm: string | undefined;
  filter: string | undefined;

  constructor() { }
}
